<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage, ElIcon, ElInput, ElButton, ElMessageBox } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { matchApi } from '../../services/api'

// 基础变量声明（在计算属性之前）
const selectedNode = ref('player-card')
const seasonData = ref({})
const registrationData = ref([])
const rulesData = ref('')
const personalData = ref({
  totalMatches: 0,
  totalKills: 0,
  totalWins: 0,
  kdRatio: 0,
  bestRank: 0,
  matchHistory: []
})
const ongoingMatches = ref([])
const playerCardData = ref({
  name: '',
  gameId: '',
  phone: '',
  address: '',
  company: '',
  uuid: ''
})
const loading = ref(false)

// 选手卡编辑状态 - 当前编辑的字段
const editingField = ref(null)

// 输入框引用
const inputRefs = {
  name: ref(null),
  gameId: ref(null),
  phone: ref(null),
  address: ref(null),
  company: ref(null)
}



// 计算显示的菜单项
const displayMenuItems = computed(() => {
  const items = []
  
  // 如果有正在参加的比赛，显示在第一个
  if (ongoingMatches.value.length > 0) {
    items.push({
      id: 'ongoing',
      label: '正在参加'
    })
  }
  
  // 依次添加其他菜单项
  items.push(
    {
      id: 'player-card',
      label: '选手卡'
    },
    {
      id: 'personal',
      label: '个人数据'
    },
    {
      id: 'history',
      label: '历史赛季',
      children: [
        { id: 's1', label: '星火计划S1' },
        { id: 's2', label: '星火计划S2' },
        { id: 's3', label: '星火计划S3' }
      ]
    },
    {
      id: 'rules',
      label: '比赛规则'
    }
  )
  
  return items
})

// 监听编辑字段变化，自动聚焦输入框
watch(editingField, (newField) => {
  if (newField && inputRefs[newField]) {
    // 使用nextTick确保DOM已更新
    setTimeout(() => {
      inputRefs[newField].value?.focus()
    }, 50)
  }
})

// 组件挂载时获取默认数据
onMounted(async () => {
  await fetchOngoingMatches() // 先获取正在参加的比赛，用于计算菜单
  await fetchPlayerCardData() // 获取选手卡数据，因为默认显示选手卡页面
})


// 从后端获取赛季数据
const fetchSeasonData = async (seasonId) => {
  loading.value = true
  try {
    const data = await matchApi.getSeasonData(seasonId)
    seasonData.value[seasonId] = data
  } catch (err) {
    ElMessage.error('获取赛季数据失败')
    console.error('Failed to fetch season data:', err)
  } finally {
    loading.value = false
  }
}

// 从后端获取报名数据
const fetchRegistrationData = async () => {
  loading.value = true
  try {
    const data = await matchApi.getRegistrationData()
    registrationData.value = data
  } catch (err) {
    ElMessage.error('获取报名数据失败')
    console.error('Failed to fetch registration data:', err)
  } finally {
    loading.value = false
  }
}

// 从后端获取规则数据
const fetchRulesData = async () => {
  loading.value = true
  try {
    const data = await matchApi.getRulesData()
    rulesData.value = data
  } catch (err) {
    ElMessage.error('获取规则数据失败')
    console.error('Failed to fetch rules data:', err)
  } finally {
    loading.value = false
  }
}

// 从后端获取选手卡数据
const fetchPlayerCardData = async () => {
  loading.value = true
  try {
    const data = await matchApi.getPlayerCardData()
    playerCardData.value = {
      ...playerCardData.value,
      ...data
    }
  } catch (err) {
    ElMessage.error('获取选手卡数据失败')
    console.error('Failed to fetch player card data:', err)
  } finally {
    loading.value = false
  }
}

// 保存选手卡数据
const savePlayerCardData = async () => {
  // 校验必填项
  const missingFields = []
  if (!playerCardData.value.name) missingFields.push('姓名')
  if (!playerCardData.value.gameId) missingFields.push('游戏ID')
  if (!playerCardData.value.phone) missingFields.push('电话')
  if (!playerCardData.value.address) missingFields.push('居住地址')
  if (!playerCardData.value.company) missingFields.push('所属公司')
  
  if (missingFields.length > 0) {
    ElMessage.warning(`请填写以下字段：${missingFields.join('、')}`)
    return
  }
  
  loading.value = true
  try {
    const result = await matchApi.savePlayerCardData(playerCardData.value)
    // 保存后端返回的 uuid
    if (result.uuid) {
      playerCardData.value.uuid = result.uuid
    }
    ElMessage.success('保存成功')
  } catch (err) {
    ElMessage.error('保存失败')
    console.error('Failed to save player card data:', err)
  } finally {
    loading.value = false
  }
}

// 保存单个字段（已废弃，使用保存按钮）
const saveField = async (fieldName) => {
  // 空实现，已废弃
}

// 从后端获取个人比赛数据
const fetchPersonalData = async () => {
  loading.value = true
  try {
    const data = await matchApi.getPersonalData()
    personalData.value = data
  } catch (err) {
    ElMessage.error('获取个人比赛数据失败')
    console.error('Failed to fetch personal data:', err)
  } finally {
    loading.value = false
  }
}

// 从后端获取正在参加的比赛
const fetchOngoingMatches = async () => {
  loading.value = true
  try {
    const data = await matchApi.getOngoingMatches()
    ongoingMatches.value = data
  } catch (err) {
    ElMessage.error('获取正在参加的比赛失败')
    console.error('Failed to fetch ongoing matches:', err)
  } finally {
    loading.value = false
  }
}

// 保存选手信息
const savePlayerName = async (teamId, playerId, name) => {
  try {
    await matchApi.updatePlayerName(teamId, playerId, name)
    const team = registrationData.value.find(t => t.id === teamId)
    if (team) {
      const player = team.players.find(p => p.id === playerId)
      if (player) {
        player.name = name
        player.editable = false
      }
    }
    ElMessage.success('保存成功')
  } catch (err) {
    ElMessage.error('保存选手信息失败')
    console.error('Failed to save player name:', err)
  }
}

// 编辑选手信息
const editPlayerName = (teamId, playerId) => {
  const team = registrationData.value.find(t => t.id === teamId)
  if (team) {
    const player = team.players.find(p => p.id === playerId)
    if (player) {
      player.editable = true
    }
  }
}

// 处理树节点点击
const handleNodeClick = async (nodeId) => {
  selectedNode.value = nodeId
  
  // 根据选择的节点获取对应数据
  if (nodeId === 's1' || nodeId === 's2' || nodeId === 's3') {
    if (!seasonData.value[nodeId]) {
      await fetchSeasonData(nodeId)
    }
  } else if (nodeId === 'personal') {
    await fetchPersonalData()
  } else if (nodeId === 'ongoing') {
    await fetchOngoingMatches()
  } else if (nodeId === 'rules') {
    if (!rulesData.value) {
      await fetchRulesData()
    }
  } else if (nodeId === 'player-card') {
    await fetchPlayerCardData()
  }
}



</script>

<template>
  <div class="match-container">
    <div class="container">
      <div class="match-layout">
        <!-- 左侧导航树 -->
        <div class="match-sidebar">
          <el-menu
            :default-active="selectedNode"
            class="el-menu-vertical-demo"
            :router="false"
            @select="handleNodeClick"
          >
            <template v-for="item in displayMenuItems" :key="item.id">
              <el-sub-menu v-if="item.children" :index="item.id">
                <template #title>
                  <span>{{ item.label }}</span>
                </template>
                <el-menu-item
                  v-for="child in item.children"
                  :key="child.id"
                  :index="child.id"
                >
                  {{ child.label }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="item.id">
                {{ item.label }}
              </el-menu-item>
            </template>
          </el-menu>
        </div>
        
        <!-- 右侧内容区域 -->
        <div class="match-content">
          <!-- 错误信息 -->
          <!-- 使用 Element UI 的 el-message 组件替代 -->
          
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            加载中...
          </div>
          
          <!-- 历史赛季内容 -->
          <div v-else-if="selectedNode === 's1' || selectedNode === 's2' || selectedNode === 's3'" class="history-content">
            <h2>{{ selectedNode === 's1' ? '星火计划S1' : selectedNode === 's2' ? '星火计划S2' : '星火计划S3' }}</h2>
            
            <!-- 前三名展示 -->
            <div class="champions-section">
              <h3>赛季排名</h3>
              <div class="champions-grid">
                <div 
                  v-for="champion in seasonData[selectedNode]?.champions" 
                  :key="champion.rank"
                  class="champion-card"
                  :class="{ 'first': champion.rank === 1, 'second': champion.rank === 2, 'third': champion.rank === 3 }"
                >
                  <div class="rank">{{ champion.rank }}</div>
                  <div class="team-name">{{ champion.team }}</div>
                  <div class="points">{{ champion.points }} 分</div>
                </div>
              </div>
            </div>
            
            <!-- 队伍和选手信息 -->
            <div class="teams-section">
              <h3>队伍详情</h3>
              <div class="teams-grid">
                <div 
                  v-for="team in seasonData[selectedNode]?.teams" 
                  :key="team.id"
                  class="team-card"
                >
                  <div class="team-header">
                    <h4>{{ team.name }}</h4>
                  </div>
                  <div class="players-list">
                    <div 
                      v-for="(player, index) in team.players" 
                      :key="index"
                      class="player-item"
                    >
                      <span class="player-name">{{ player.name }}</span>
                      <span class="player-kills">击杀: {{ player.kills }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 个人比赛数据 -->
          <div v-else-if="selectedNode === 'personal'" class="personal-content">
            <h2>个人数据</h2>
            
            <!-- 个人统计 -->
            <div class="personal-stats">
              <h3>个人统计</h3>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">{{ personalData.totalMatches }}</div>
                  <div class="stat-label">总场次</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ personalData.totalKills }}</div>
                  <div class="stat-label">总击杀</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ personalData.totalWins }}</div>
                  <div class="stat-label">获胜场次</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ personalData.kdRatio }}</div>
                  <div class="stat-label">KD比率</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ personalData.bestRank }}</div>
                  <div class="stat-label">最佳排名</div>
                </div>
              </div>
            </div>
            
            <!-- 比赛历史 -->
            <div class="match-history">
              <h3>比赛历史</h3>
              <div v-if="personalData.matchHistory.length === 0" class="empty-state">
                暂无比赛记录
              </div>
              <div v-else class="match-history-list">
                <div 
                  v-for="match in personalData.matchHistory" 
                  :key="match.id"
                  class="match-history-item"
                >
                  <div class="match-info">
                    <h4>{{ match.name }}</h4>
                    <div class="match-details">
                      <span>日期: {{ match.date }}</span>
                      <span>排名: {{ match.rank }}</span>
                      <span>击杀: {{ match.kills }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 正在参加的比赛 -->
          <div v-else-if="selectedNode === 'ongoing'" class="ongoing-content">
            <h2>正在参加</h2>
            
            <div v-if="ongoingMatches.length === 0" class="empty-state">
              暂无正在参加的比赛
            </div>
            <div v-else class="ongoing-matches-list">
              <div 
                v-for="match in ongoingMatches" 
                :key="match.id"
                class="ongoing-match-card"
              >
                <div class="match-header">
                  <h3>{{ match.name }}</h3>
                  <span class="match-status">{{ match.status }}</span>
                </div>
                <div class="match-info">
                  <div class="match-date">{{ match.date }}</div>
                  <div class="match-location">{{ match.location }}</div>
                  <div class="match-description">{{ match.description }}</div>
                </div>
                <div class="match-actions">
                  <button class="details-button">查看详情</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 比赛规则内容 -->
          <div v-else-if="selectedNode === 'rules'" class="rules-content">
            <h2>比赛规则</h2>
            <div class="rules-text" v-html="rulesData.replace(/\n/g, '<br>').replace(/# (.*?)(?=\n|$)/g, '<h3>$1</h3>').replace(/## (.*?)(?=\n|$)/g, '<h4>$1</h4>')"></div>
          </div>
          
          <!-- 选手卡内容 -->
          <div v-else-if="selectedNode === 'player-card'" class="player-card-content">
            <div class="player-card-description">
              <p>1. 参加比赛需要先填写选手卡。</p>
              <p>2. 居住地址请务必填写您现在能够收到快递的地址。</p>
              <p>3. 你的电话地址信息我们只用于奖励发放。</p>
            </div>
            <div class="player-card-section">
              <div class="card">
                <div class="card-header">
                  <h4>星火計劃 {{ new Date().getFullYear() }}</h4>
                </div>
                <div class="card-body">
                  <div class="card-info">
                    <div 
                      class="info-item"
                      :class="{ 'editing': editingField === 'name' }"
                    >
                      <span class="label">姓名:</span>
                      <span 
                        v-if="!editingField || editingField !== 'name'" 
                        class="value"
                        @click="editingField = 'name'"
                      >
                        {{ playerCardData.name || '点击编辑' }}
                      </span>
                      <el-input 
                        v-else 
                        v-model="playerCardData.name"
                        size="small"
                        class="card-input"
                        placeholder="请输入姓名"
                        @blur="editingField = null"
                        ref="inputRefs.name"
                      />
                    </div>
                    <div 
                      class="info-item"
                      :class="{ 'editing': editingField === 'gameId' }"
                    >
                      <span class="label">游戏ID:</span>
                      <span 
                        v-if="!editingField || editingField !== 'gameId'" 
                        class="value"
                        @click="editingField = 'gameId'"
                      >
                        {{ playerCardData.gameId || '点击编辑' }}
                      </span>
                      <el-input 
                        v-else 
                        v-model="playerCardData.gameId"
                        size="small"
                        class="card-input"
                        placeholder="请输入游戏ID"
                        @blur="editingField = null"
                        ref="inputRefs.gameId"
                      />
                    </div>
                    <div 
                      class="info-item"
                      :class="{ 'editing': editingField === 'phone' }"
                    >
                      <span class="label">电话:</span>
                      <span 
                        v-if="!editingField || editingField !== 'phone'" 
                        class="value"
                        @click="editingField = 'phone'"
                      >
                        {{ playerCardData.phone || '点击编辑' }}
                      </span>
                      <el-input 
                        v-else 
                        v-model="playerCardData.phone"
                        size="small"
                        class="card-input"
                        placeholder="请输入电话"
                        @blur="editingField = null"
                        ref="inputRefs.phone"
                      />
                    </div>
                    <div 
                      class="info-item"
                      :class="{ 'editing': editingField === 'address' }"
                    >
                      <span class="label">居住地址:</span>
                      <span 
                        v-if="!editingField || editingField !== 'address'" 
                        class="value address-value"
                        @click="editingField = 'address'"
                      >
                        {{ playerCardData.address || '点击编辑' }}
                      </span>
                      <el-input 
                        v-else 
                        v-model="playerCardData.address"
                        size="small"
                        class="card-input address-input"
                        placeholder="请输入居住地址"
                        @blur="editingField = null"
                        ref="inputRefs.address"
                      />
                    </div>
                    <div 
                      class="info-item"
                      :class="{ 'editing': editingField === 'company' }"
                    >
                      <span class="label">所属公司:</span>
                      <span 
                        v-if="!editingField || editingField !== 'company'" 
                        class="value"
                        @click="editingField = 'company'"
                      >
                        {{ playerCardData.company || '点击编辑' }}
                      </span>
                      <el-input 
                        v-else 
                        v-model="playerCardData.company"
                        size="small"
                        class="card-input"
                        placeholder="请输入所属公司"
                        @blur="editingField = null"
                        ref="inputRefs.company"
                      />
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <p>星火計劃 © {{ new Date().getFullYear() }}</p>
                </div>
              </div>
              <!-- 保存按钮 -->
              <div class="card-actions">
                <el-button 
                  type="primary" 
                  @click="savePlayerCardData"
                >
                  保存选手卡
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.match-container {
  min-height: 100vh;
  padding: 8rem 0 4rem;
  background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
}

.match-layout {
  display: flex;
  gap: 2rem;
}

/* 左侧导航树 */
.match-sidebar {
  width: 250px;
  flex-shrink: 0;
}

/* Element UI 菜单样式 */
.el-menu-vertical-demo {
  background-color: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
  border: none !important;
  overflow: hidden !important;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px !important;
}

.el-menu-item {
  font-size: 0.9375rem !important;
  font-weight: 500 !important;
  color: #1d1d1f !important;
  height: 3.5rem !important;
  line-height: 3.5rem !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

.el-menu-item:hover {
  background-color: #f5f5f7 !important;
  color: #0071e3 !important;
}

.el-menu-item.is-active {
  background-color: #1d1d1f !important;
  color: #ffffff !important;
}

.el-sub-menu__title {
  font-size: 0.9375rem !important;
  font-weight: 500 !important;
  color: #1d1d1f !important;
  height: 3.5rem !important;
  line-height: 3.5rem !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

.el-sub-menu__title:hover {
  background-color: #f5f5f7 !important;
  color: #0071e3 !important;
}

.el-sub-menu .el-menu {
  background-color: #f9f9f9 !important;
}

.el-sub-menu .el-menu-item {
  font-size: 0.875rem !important;
  color: #86868b !important;
  height: 2.75rem !important;
  line-height: 2.75rem !important;
  padding-left: 2.5rem !important;
}

.el-sub-menu .el-menu-item:hover {
  background-color: #f0f0f0 !important;
  color: #0071e3 !important;
}

.el-sub-menu .el-menu-item.is-active {
  background-color: #1d1d1f !important;
  color: #ffffff !important;
  font-weight: 500 !important;
}

/* 右侧内容区域 */
.match-content {
  flex: 1;
}

.match-content h2 {
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
}

.match-content h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
}

/* 加载状态和错误信息 */
.loading-state {
  text-align: center;
  padding: 4rem;
  color: #86868b;
  font-size: 1.125rem;
}

/* 错误信息和成功信息样式已移除，改用 Element UI 的 ElMessage 组件 */

/* 历史赛季内容 */
.champions-section {
  margin-bottom: 3rem;
}

.champions-grid {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.champion-card {
  flex: 1;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.champion-card:hover {
  transform: translateY(-4px);
}

.champion-card.first {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1d1d1f;
}

.champion-card.second {
  background: linear-gradient(135deg, #c0c0c0 0%, #e0e0e0 100%);
  color: #1d1d1f;
}

.champion-card.third {
  background: linear-gradient(135deg, #cd7f32 0%, #e6c29e 100%);
  color: #1d1d1f;
}

.champion-card .rank {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.champion-card .team-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.champion-card .points {
  font-size: 1rem;
  opacity: 0.9;
}

.teams-section {
  margin-top: 3rem;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.team-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.team-header h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d1d1f;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f5f5f7;
  border-radius: 8px;
}

.player-name {
  font-size: 0.875rem;
  color: #1d1d1f;
}

.player-kills {
  font-size: 0.75rem;
  color: #86868b;
  font-weight: 500;
}



/* 比赛规则内容 */
.rules-content {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.rules-text {
  line-height: 1.6;
  color: #1d1d1f;
}

.rules-text h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
}

.rules-text h4 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: #1d1d1f;
}

.rules-text p {
  margin-bottom: 1rem;
}

/* 个人比赛数据样式 */
.personal-content {
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.personal-stats {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-card {
  background-color: #f5f5f7;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #86868b;
}

.match-history {
  margin-top: 3rem;
}

.match-history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.match-history-item {
  background-color: #f5f5f7;
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.match-history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.match-info h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d1d1f;
}

.match-details {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: #86868b;
}

/* 正在参加的比赛样式 */
.ongoing-content {
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.ongoing-matches-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.ongoing-match-card {
  background-color: #f5f5f7;
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.ongoing-match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.match-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d1d1f;
}

.match-status {
  padding: 0.25rem 0.75rem;
  background-color: #0071e3;
  color: #ffffff;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.match-info {
  margin-bottom: 1.5rem;
}

.match-date {
  font-size: 0.875rem;
  color: #86868b;
  margin-bottom: 0.5rem;
}

.match-location {
  font-size: 0.875rem;
  color: #86868b;
  margin-bottom: 0.5rem;
}

.match-description {
  font-size: 0.875rem;
  color: #1d1d1f;
  line-height: 1.4;
}

.match-actions {
  display: flex;
  justify-content: flex-end;
}

.details-button {
  padding: 0.5rem 1rem;
  background-color: #1d1d1f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.details-button:hover {
  background-color: #000000;
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #86868b;
  background-color: #f5f5f7;
  border-radius: 12px;
  margin-top: 1.5rem;
}

/* 选手卡样式 */
.player-card-content {
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.player-card-description {
  background-color: #f5f5f7;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  color: #1d1d1f;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
}

.player-card-description p {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 12px;
  padding: 0;
  margin-top: 0;
}

.player-card-description p:last-child {
  margin-bottom: 0;
}

.player-card-section {
  margin-top: 50px;
  margin-bottom: 50px;
}

.gray-text {
  color: #86868b;
  font-size: 0.75rem;
}

.card {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
}

.card-header {
  background: linear-gradient(135deg, #1d1d1f 0%, #000000 100%);
  color: #ffffff;
  padding: 1.5rem;
  text-align: center;
}

.card-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
}

.edit-button {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover .edit-button {
  opacity: 1;
}

.card-input {
  width: 150px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.info-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background-color: #f9f9f9;
}

.info-item.editing {
  cursor: default;
  background-color: #f0f0f0;
}

.card-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.card-body {
  padding: 2rem;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-item .label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #86868b;
}

.info-item .value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1d1d1f;
  transition: color 0.3s ease;
}

.info-item:hover .value {
  color: #0071e3;
  text-decoration: underline;
}

.address-value {
  max-width: 40%;
  overflow: hidden;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.2;
}

.address-input {
  max-width: 40%;
}

.card-footer {
  background-color: #f5f5f7;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #d2d2d7;
}

.card-footer p {
  margin: 0;
  font-size: 0.75rem;
  color: #86868b;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .match-layout {
    flex-direction: column;
  }
  
  .match-sidebar {
    width: 100%;
    margin-bottom: 2rem;
  }
  
  .teams-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .registration-teams {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .match-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 768px) {
  .match-container {
    padding: 6rem 0 2rem;
  }
  
  .champions-grid {
    flex-direction: column;
  }
  
  .champion-card {
    width: 100%;
  }
  
  .teams-grid {
    grid-template-columns: 1fr;
  }
  
  .player-registration {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .player-input {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .match-history-item,
  .ongoing-match-card {
    padding: 1.25rem;
  }
  
  .match-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .match-actions {
    justify-content: flex-start;
  }
}


</style>