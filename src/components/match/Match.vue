<script setup>
import { ref } from 'vue'

// 左侧导航树数据
const treeItems = ref([
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
    id: 'registration',
    label: '赛季报名'
  },
  {
    id: 'rules',
    label: '比赛规则'
  }

])

// 当前选中的树节点
const selectedNode = ref('s1')

// 历史赛季数据
const seasonData = ref({
  s1: {
    champions: [
      { rank: 1, team: '桑勤鸣队', points: 120 },
      { rank: 2, team: '刘志队', points: 95 },
      { rank: 3, team: '郭正阳队', points: 80 }
    ],
    teams: [
      {
        id: 1,
        name: '桑勤鸣队',
        players: [
          { name: '桑勤鸣', kills: 15 },
          { name: '刘志', kills: 12 },
          { name: '郭正阳', kills: 8 },
          { name: '郭鑫鑫', kills: 5 }
        ]
      },
      {
        id: 2,
        name: '刘志队',
        players: [
          { name: '刘志', kills: 18 },
          { name: '胡成', kills: 10 },
          { name: '陈红喜', kills: 7 },
          { name: '桑勤鸣', kills: 4 }
        ]
      },
      {
        id: 3,
        name: '郭正阳队',
        players: [
          { name: '郭正阳', kills: 12 },
          { name: '郭鑫鑫', kills: 9 },
          { name: '胡成', kills: 6 },
          { name: '陈红喜', kills: 3 }
        ]
      },
      {
        id: 4,
        name: '郭鑫鑫队',
        players: [
          { name: '郭鑫鑫', kills: 10 },
          { name: '桑勤鸣', kills: 8 },
          { name: '刘志', kills: 5 },
          { name: '胡成', kills: 2 }
        ]
      },
      {
        id: 5,
        name: '胡成队',
        players: [
          { name: '胡成', kills: 9 },
          { name: '陈红喜', kills: 7 },
          { name: '桑勤鸣', kills: 4 },
          { name: '刘志', kills: 1 }
        ]
      },
      {
        id: 6,
        name: '陈红喜队',
        players: [
          { name: '陈红喜', kills: 8 },
          { name: '桑勤鸣', kills: 6 },
          { name: '刘志', kills: 3 },
          { name: '郭正阳', kills: 0 }
        ]
      },
      {
        id: 7,
        name: '星火队1',
        players: [
          { name: '桑勤鸣', kills: 7 },
          { name: '郭鑫鑫', kills: 5 },
          { name: '胡成', kills: 2 },
          { name: '陈红喜', kills: 0 }
        ]
      },
      {
        id: 8,
        name: '星火队2',
        players: [
          { name: '刘志', kills: 6 },
          { name: '郭正阳', kills: 4 },
          { name: '桑勤鸣', kills: 1 },
          { name: '郭鑫鑫', kills: 0 }
        ]
      },
      {
        id: 9,
        name: '星火队3',
        players: [
          { name: '郭正阳', kills: 5 },
          { name: '胡成', kills: 3 },
          { name: '刘志', kills: 0 },
          { name: '陈红喜', kills: 0 }
        ]
      },
      {
        id: 10,
        name: '星火队4',
        players: [
          { name: '郭鑫鑫', kills: 4 },
          { name: '陈红喜', kills: 2 },
          { name: '郭正阳', kills: 0 },
          { name: '桑勤鸣', kills: 0 }
        ]
      },
      {
        id: 11,
        name: '星火队5',
        players: [
          { name: '胡成', kills: 3 },
          { name: '桑勤鸣', kills: 1 },
          { name: '郭鑫鑫', kills: 0 },
          { name: '刘志', kills: 0 }
        ]
      },
      {
        id: 12,
        name: '星火队6',
        players: [
          { name: '陈红喜', kills: 2 },
          { name: '刘志', kills: 0 },
          { name: '胡成', kills: 0 },
          { name: '郭正阳', kills: 0 }
        ]
      },
      {
        id: 13,
        name: '星火队7',
        players: [
          { name: '桑勤鸣', kills: 1 },
          { name: '郭正阳', kills: 0 },
          { name: '陈红喜', kills: 0 },
          { name: '郭鑫鑫', kills: 0 }
        ]
      },
      {
        id: 14,
        name: '星火队8',
        players: [
          { name: '刘志', kills: 0 },
          { name: '桑勤鸣', kills: 0 },
          { name: '胡成', kills: 0 },
          { name: '陈红喜', kills: 0 }
        ]
      },
      {
        id: 15,
        name: '星火队9',
        players: [
          { name: '郭正阳', kills: 0 },
          { name: '刘志', kills: 0 },
          { name: '郭鑫鑫', kills: 0 },
          { name: '胡成', kills: 0 }
        ]
      },
      {
        id: 16,
        name: '星火队10',
        players: [
          { name: '郭鑫鑫', kills: 0 },
          { name: '陈红喜', kills: 0 },
          { name: '桑勤鸣', kills: 0 },
          { name: '刘志', kills: 0 }
        ]
      }
    ]
  },
  s2: {
    champions: [
      { rank: 1, team: '胡成队', points: 135 },
      { rank: 2, team: '陈红喜队', points: 110 },
      { rank: 3, team: '桑勤鸣队', points: 90 }
    ],
    teams: [
      {
        id: 1,
        name: '胡成队',
        players: [
          { name: '胡成', kills: 20 },
          { name: '陈红喜', kills: 15 },
          { name: '桑勤鸣', kills: 10 },
          { name: '刘志', kills: 5 }
        ]
      },
      {
        id: 2,
        name: '陈红喜队',
        players: [
          { name: '陈红喜', kills: 18 },
          { name: '郭正阳', kills: 12 },
          { name: '郭鑫鑫', kills: 8 },
          { name: '胡成', kills: 4 }
        ]
      },
      {
        id: 3,
        name: '桑勤鸣队',
        players: [
          { name: '桑勤鸣', kills: 16 },
          { name: '刘志', kills: 10 },
          { name: '郭正阳', kills: 6 },
          { name: '郭鑫鑫', kills: 2 }
        ]
      },
      {
        id: 4,
        name: '刘志队',
        players: [
          { name: '刘志', kills: 14 },
          { name: '郭鑫鑫', kills: 9 },
          { name: '胡成', kills: 5 },
          { name: '陈红喜', kills: 1 }
        ]
      },
      {
        id: 5,
        name: '郭正阳队',
        players: [
          { name: '郭正阳', kills: 12 },
          { name: '桑勤鸣', kills: 8 },
          { name: '刘志', kills: 4 },
          { name: '郭鑫鑫', kills: 0 }
        ]
      },
      {
        id: 6,
        name: '郭鑫鑫队',
        players: [
          { name: '郭鑫鑫', kills: 10 },
          { name: '胡成', kills: 6 },
          { name: '陈红喜', kills: 3 },
          { name: '桑勤鸣', kills: 0 }
        ]
      },
      {
        id: 7,
        name: '星火队11',
        players: [
          { name: '陈红喜', kills: 9 },
          { name: '桑勤鸣', kills: 5 },
          { name: '刘志', kills: 2 },
          { name: '郭正阳', kills: 0 }
        ]
      },
      {
        id: 8,
        name: '星火队12',
        players: [
          { name: '胡成', kills: 8 },
          { name: '郭鑫鑫', kills: 4 },
          { name: '陈红喜', kills: 1 },
          { name: '桑勤鸣', kills: 0 }
        ]
      },
      {
        id: 9,
        name: '星火队13',
        players: [
          { name: '郭正阳', kills: 7 },
          { name: '刘志', kills: 3 },
          { name: '胡成', kills: 0 },
          { name: '陈红喜', kills: 0 }
        ]
      },
      {
        id: 10,
        name: '星火队14',
        players: [
          { name: '桑勤鸣', kills: 6 },
          { name: '郭鑫鑫', kills: 2 },
          { name: '陈红喜', kills: 0 },
          { name: '胡成', kills: 0 }
        ]
      },
      {
        id: 11,
        name: '星火队15',
        players: [
          { name: '刘志', kills: 5 },
          { name: '桑勤鸣', kills: 1 },
          { name: '郭正阳', kills: 0 },
          { name: '郭鑫鑫', kills: 0 }
        ]
      },
      {
        id: 12,
        name: '星火队16',
        players: [
          { name: '陈红喜', kills: 4 },
          { name: '胡成', kills: 0 },
          { name: '刘志', kills: 0 },
          { name: '桑勤鸣', kills: 0 }
        ]
      },
      {
        id: 13,
        name: '星火队17',
        players: [
          { name: '郭鑫鑫', kills: 3 },
          { name: '陈红喜', kills: 0 },
          { name: '胡成', kills: 0 },
          { name: '刘志', kills: 0 }
        ]
      },
      {
        id: 14,
        name: '星火队18',
        players: [
          { name: '郭正阳', kills: 2 },
          { name: '郭鑫鑫', kills: 0 },
          { name: '桑勤鸣', kills: 0 },
          { name: '刘志', kills: 0 }
        ]
      },
      {
        id: 15,
        name: '星火队19',
        players: [
          { name: '桑勤鸣', kills: 1 },
          { name: '陈红喜', kills: 0 },
          { name: '胡成', kills: 0 },
          { name: '郭正阳', kills: 0 }
        ]
      },
      {
        id: 16,
        name: '星火队20',
        players: [
          { name: '刘志', kills: 0 },
          { name: '郭鑫鑫', kills: 0 },
          { name: '陈红喜', kills: 0 },
          { name: '胡成', kills: 0 }
        ]
      }
    ]
  },
  s3: {
    champions: [
      { rank: 1, team: '郭鑫鑫队', points: 140 },
      { rank: 2, team: '胡成队', points: 115 },
      { rank: 3, team: '陈红喜队', points: 95 }
    ],
    teams: [
      {
        id: 1,
        name: '郭鑫鑫队',
        players: [
          { name: '郭鑫鑫', kills: 22 },
          { name: '桑勤鸣', kills: 18 },
          { name: '刘志', kills: 12 },
          { name: '郭正阳', kills: 6 }
        ]
      },
      {
        id: 2,
        name: '胡成队',
        players: [
          { name: '胡成', kills: 20 },
          { name: '陈红喜', kills: 14 },
          { name: '郭正阳', kills: 8 },
          { name: '郭鑫鑫', kills: 4 }
        ]
      },
      {
        id: 3,
        name: '陈红喜队',
        players: [
          { name: '陈红喜', kills: 18 },
          { name: '桑勤鸣', kills: 12 },
          { name: '刘志', kills: 6 },
          { name: '胡成', kills: 2 }
        ]
      },
      {
        id: 4,
        name: '桑勤鸣队',
        players: [
          { name: '桑勤鸣', kills: 16 },
          { name: '郭正阳', kills: 10 },
          { name: '郭鑫鑫', kills: 5 },
          { name: '陈红喜', kills: 1 }
        ]
      },
      {
        id: 5,
        name: '刘志队',
        players: [
          { name: '刘志', kills: 14 },
          { name: '胡成', kills: 9 },
          { name: '陈红喜', kills: 4 },
          { name: '桑勤鸣', kills: 0 }
        ]
      },
      {
        id: 6,
        name: '郭正阳队',
        players: [
          { name: '郭正阳', kills: 12 },
          { name: '桑勤鸣', kills: 8 },
          { name: '刘志', kills: 3 },
          { name: '胡成', kills: 0 }
        ]
      },
      {
        id: 7,
        name: '星火队21',
        players: [
          { name: '胡成', kills: 10 },
          { name: '郭鑫鑫', kills: 6 },
          { name: '陈红喜', kills: 2 },
          { name: '桑勤鸣', kills: 0 }
        ]
      },
      {
        id: 8,
        name: '星火队22',
        players: [
          { name: '陈红喜', kills: 9 },
          { name: '刘志', kills: 5 },
          { name: '郭正阳', kills: 1 },
          { name: '郭鑫鑫', kills: 0 }
        ]
      },
      {
        id: 9,
        name: '星火队23',
        players: [
          { name: '桑勤鸣', kills: 8 },
          { name: '陈红喜', kills: 4 },
          { name: '胡成', kills: 0 },
          { name: '刘志', kills: 0 }
        ]
      },
      {
        id: 10,
        name: '星火队24',
        players: [
          { name: '郭鑫鑫', kills: 7 },
          { name: '郭正阳', kills: 3 },
          { name: '桑勤鸣', kills: 0 },
          { name: '刘志', kills: 0 }
        ]
      },
      {
        id: 11,
        name: '星火队25',
        players: [
          { name: '刘志', kills: 6 },
          { name: '胡成', kills: 2 },
          { name: '陈红喜', kills: 0 },
          { name: '郭正阳', kills: 0 }
        ]
      },
      {
        id: 12,
        name: '星火队26',
        players: [
          { name: '郭正阳', kills: 5 },
          { name: '桑勤鸣', kills: 1 },
          { name: '郭鑫鑫', kills: 0 },
          { name: '胡成', kills: 0 }
        ]
      },
      {
        id: 13,
        name: '星火队27',
        players: [
          { name: '桑勤鸣', kills: 4 },
          { name: '陈红喜', kills: 0 },
          { name: '刘志', kills: 0 },
          { name: '郭正阳', kills: 0 }
        ]
      },
      {
        id: 14,
        name: '星火队28',
        players: [
          { name: '胡成', kills: 3 },
          { name: '郭鑫鑫', kills: 0 },
          { name: '桑勤鸣', kills: 0 },
          { name: '陈红喜', kills: 0 }
        ]
      },
      {
        id: 15,
        name: '星火队29',
        players: [
          { name: '陈红喜', kills: 2 },
          { name: '刘志', kills: 0 },
          { name: '郭正阳', kills: 0 },
          { name: '郭鑫鑫', kills: 0 }
        ]
      },
      {
        id: 16,
        name: '星火队30',
        players: [
          { name: '郭鑫鑫', kills: 1 },
          { name: '郭正阳', kills: 0 },
          { name: '胡成', kills: 0 },
          { name: '陈红喜', kills: 0 }
        ]
      }
    ]
  }
})

// 赛季报名数据
const registrationData = ref([
  {
    id: 1,
    name: 'Team 1',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 2,
    name: 'Team 2',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 3,
    name: 'Team 3',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 4,
    name: 'Team 4',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 5,
    name: 'Team 5',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 6,
    name: 'Team 6',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 7,
    name: 'Team 7',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 8,
    name: 'Team 8',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 9,
    name: 'Team 9',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 10,
    name: 'Team 10',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 11,
    name: 'Team 11',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 12,
    name: 'Team 12',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 13,
    name: 'Team 13',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 14,
    name: 'Team 14',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 15,
    name: 'Team 15',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  },
  {
    id: 16,
    name: 'Team 16',
    players: [
      { id: 1, position: '队员1', name: '', editable: true },
      { id: 2, position: '队员2', name: '', editable: true },
      { id: 3, position: '队员3', name: '', editable: true },
      { id: 4, position: '队员4', name: '', editable: true },
      { id: 5, position: '替补', name: '', editable: true }
    ]
  }
])

// 比赛规则数据（PUBG PGS赛事规则）
const rulesData = ref(`# PUBG PGS 赛事规则

## 1. 赛事概述
PUBG Global Series (PGS) 是 PUBG 官方举办的全球性职业赛事，汇聚来自世界各地的顶尖战队，争夺高额奖金和荣誉。

## 2. 参赛资格
- 各地区预选赛优胜队伍
- 直接邀请的顶级战队
- 每个队伍由4名正式队员和1名替补队员组成

## 3. 比赛模式
- 采用标准竞技模式
- 使用最新版本的游戏客户端
- 地图轮换：Erangel、Miramar、Sanhok、Vikendi、Karakin、Deston

## 4. 积分规则
- 排名分：根据每局比赛的最终排名获得积分
- 击杀分：每击杀一名敌人获得1分
- 首杀额外加1分

## 5. 排名积分表
1. 第1名：15分
2. 第2名：12分
3. 第3名：10分
4. 第4名：8分
5. 第5名：7分
6. 第6名：6分
7. 第7-8名：5分
8. 第9-12名：3分
9. 第13-16名：2分
10. 第17-20名：1分

## 6. 赛事流程
1. 小组赛：所有队伍分为多个小组进行单循环比赛
2. 淘汰赛：小组前几名晋级淘汰赛
3. 总决赛：最终的16支队伍进行决赛，决出总冠军

## 7. 规则变更
- 赛事组委会有权根据实际情况调整规则
- 所有规则变更将提前通知参赛队伍

## 8. 申诉机制
- 比赛中遇到问题可向裁判提出申诉
- 申诉必须在比赛结束后30分钟内提交
- 裁判的判决为最终判决

## 9. 纪律处分
- 违反规则的队伍将受到警告、扣分或取消资格的处罚
- 严重违规将被禁赛

## 10. 其他
- 所有参赛选手必须遵守主办方的防疫规定
- 赛事最终解释权归主办方所有`)

// 处理树节点点击
const handleNodeClick = (nodeId) => {
  selectedNode.value = nodeId
}

// 保存选手信息
const savePlayerName = (teamId, playerId, name) => {
  const team = registrationData.value.find(t => t.id === teamId)
  if (team) {
    const player = team.players.find(p => p.id === playerId)
    if (player) {
      player.name = name
      player.editable = false
    }
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


</script>

<template>
  <div class="match-container">
    <div class="container">
      <div class="match-layout">
        <!-- 左侧导航树 -->
        <div class="match-sidebar">
          <h3>比赛管理</h3>
          <ul class="tree-nav">
            <li class="tree-item">
              <span class="tree-label">{{ treeItems[0].label }}</span>
              <ul class="tree-children">
                <li 
                  v-for="child in treeItems[0].children" 
                  :key="child.id"
                  class="tree-child-item"
                  :class="{ 'active': selectedNode === child.id }"
                  @click="handleNodeClick(child.id)"
                >
                  {{ child.label }}
                </li>
              </ul>
            </li>
            <li 
              class="tree-item"
              :class="{ 'active': selectedNode === treeItems[1].id }"
              @click="handleNodeClick(treeItems[1].id)"
            >
              <span class="tree-label">{{ treeItems[1].label }}</span>
            </li>
            <li 
              class="tree-item"
              :class="{ 'active': selectedNode === treeItems[2].id }"
              @click="handleNodeClick(treeItems[2].id)"
            >
              <span class="tree-label">{{ treeItems[2].label }}</span>
            </li>
          </ul>
        </div>
        
        <!-- 右侧内容区域 -->
        <div class="match-content">
          <!-- 历史赛季内容 -->
          <div v-if="selectedNode === 's1' || selectedNode === 's2' || selectedNode === 's3'" class="history-content">
            <h2>{{ treeItems[0].children.find(child => child.id === selectedNode)?.label }}</h2>
            
            <!-- 前三名展示 -->
            <div class="champions-section">
              <h3>赛季排名</h3>
              <div class="champions-grid">
                <div 
                  v-for="champion in seasonData[selectedNode].champions" 
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
                  v-for="team in seasonData[selectedNode].teams" 
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
          
          <!-- 赛季报名内容 -->
          <div v-else-if="selectedNode === 'registration'" class="registration-content">
            <h2>{{ treeItems[1].label }}</h2>
            <p>请为每个队伍的队员输入游戏ID</p>
            
            <div class="registration-teams">
              <div 
                v-for="team in registrationData" 
                :key="team.id"
                class="registration-team"
              >
                <h3>{{ team.name }}</h3>
                <div class="team-players">
                  <div 
                    v-for="player in team.players" 
                    :key="player.id"
                    class="player-registration"
                  >
                    <span class="player-position">{{ player.position }}:</span>
                    <div class="player-input">
                      <input 
                        v-if="player.editable"
                        type="text"
                        :value="player.name"
                        @input="(e) => player.name = e.target.value"
                        :placeholder="'输入游戏ID'"
                      />
                      <span v-else class="player-name-display">{{ player.name || '未设置' }}</span>
                      <div class="player-actions">
                        <button 
                          v-if="player.editable"
                          class="save-button"
                          @click="savePlayerName(team.id, player.id, player.name)"
                        >
                          确认
                        </button>
                        <button 
                          v-else
                          class="edit-button"
                          @click="editPlayerName(team.id, player.id)"
                        >
                          编辑
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 比赛规则内容 -->
          <div v-else-if="selectedNode === 'rules'" class="rules-content">
            <h2>{{ treeItems[2].label }}</h2>
            <div class="rules-text" v-html="rulesData.replace(/\n/g, '<br>').replace(/# (.*?)(?=\n|$)/g, '<h3>$1</h3>').replace(/## (.*?)(?=\n|$)/g, '<h4>$1</h4>')"></div>
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

.match-sidebar h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
}

.tree-nav {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tree-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.tree-item:last-child {
  border-bottom: none;
}

.tree-label {
  display: block;
  padding: 1rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1d1d1f;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tree-item:hover .tree-label {
  background-color: #f5f5f7;
  color: #0071e3;
}

.tree-item.active .tree-label {
  background-color: #0071e3;
  color: #ffffff;
}

.tree-children {
  background-color: #f9f9f9;
}

.tree-child-item {
  padding: 0.75rem 1.5rem 0.75rem 2.5rem;
  font-size: 0.875rem;
  color: #86868b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tree-child-item:hover {
  background-color: #f0f0f0;
  color: #0071e3;
}

.tree-child-item.active {
  background-color: #e8f0fe;
  color: #0071e3;
  font-weight: 500;
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

/* 赛季报名内容 */
.registration-content p {
  margin-bottom: 2rem;
  color: #86868b;
  font-size: 1rem;
}

.registration-teams {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.registration-team {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
}

.registration-team h3 {
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d1d1f;
}

.team-players {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.player-registration {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.player-position {
  width: 60px;
  font-size: 0.875rem;
  color: #86868b;
  font-weight: 500;
}

.player-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.player-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.player-input input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

.player-name-display {
  flex: 1;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  color: #1d1d1f;
  font-weight: 500;
}

.player-actions {
  display: flex;
  gap: 0.5rem;
}

.save-button, .edit-button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.save-button {
  background-color: #0071e3;
  color: #ffffff;
}

.save-button:hover {
  background-color: #0077ed;
}

.edit-button {
  background-color: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
}

.edit-button:hover {
  background-color: #ebebeb;
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
}
</style>