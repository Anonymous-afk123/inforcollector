import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network } from '@/network'
import { User, FileText, History, Plus, ChevronRight, Copy, Check } from 'lucide-react-taro'
import './index.css'

interface UserInfo {
  id: string
  openid: string
  nickname: string
  avatar_url: string
  phone?: string
  created_at: string
}

interface LoginResponse {
  code: number
  msg: string
  data: {
    user: UserInfo
    token: string
  }
}

interface FormRecord {
  id: string
  query_code: string
  software_full_name: string
  version: string
  created_at: string
}

interface FormsListResponse {
  code: number
  msg: string
  data: FormRecord[]
}

export default function Index() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [formRecords, setFormRecords] = useState<FormRecord[]>([])
  const [recordsLoading, setRecordsLoading] = useState(false)

  useEffect(() => {
    // 检查本地存储的用户信息
    const storedUser = Taro.getStorageSync('userInfo')
    if (storedUser) {
      setUserInfo(storedUser)
      loadFormRecords(storedUser.id)
    }
  }, [])

  const loadFormRecords = async (userId: string) => {
    setRecordsLoading(true)
    try {
      const response = await Network.request<FormsListResponse>({
        url: `/api/software-copyright/forms?user_id=${userId}`,
      })
      if (response.data?.code === 200) {
        setFormRecords(response.data.data || [])
      }
    } catch (error) {
      console.error('加载历史记录失败:', error)
    } finally {
      setRecordsLoading(false)
    }
  }

  const handleWechatLogin = async () => {
    setLoading(true)
    try {
      const env = Taro.getEnv()
      
      if (env === Taro.ENV_TYPE.WEAPP || env === Taro.ENV_TYPE.TT) {
        const { code } = await Taro.login()
        const response = await Network.request<LoginResponse>({
          url: '/api/user/wechat-login',
          method: 'POST',
          data: { code },
        })

        if (response.data?.code === 200 && response.data.data) {
          const { user, token } = response.data.data
          setUserInfo(user)
          Taro.setStorageSync('userInfo', user)
          Taro.setStorageSync('token', token)
          loadFormRecords(user.id)
          Taro.showToast({ title: '登录成功', icon: 'success' })
        }
      } else {
        const mockCode = `mock_code_${Date.now()}`
        const response = await Network.request<LoginResponse>({
          url: '/api/user/wechat-login',
          method: 'POST',
          data: {
            code: mockCode,
            nickname: '测试用户',
            avatar_url: '',
          },
        })

        if (response.data?.code === 200 && response.data.data) {
          const { user, token } = response.data.data
          setUserInfo(user)
          Taro.setStorageSync('userInfo', user)
          Taro.setStorageSync('token', token)
          loadFormRecords(user.id)
          Taro.showToast({ title: '登录成功', icon: 'success' })
        }
      }
    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({ title: '登录失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          setUserInfo(null)
          setFormRecords([])
          Taro.removeStorageSync('userInfo')
          Taro.removeStorageSync('token')
          Taro.showToast({ title: '已退出登录', icon: 'success' })
        }
      },
    })
  }

  const handleStartFill = () => {
    Taro.navigateTo({ url: '/pages/form/index' })
  }

  const handleCopyQueryCode = (code: string) => {
    Taro.setClipboardData({
      data: code,
      success: () => {
        Taro.showToast({ title: '已复制查询码', icon: 'success' })
      },
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <ScrollView className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <View className="px-4 py-6">
        {/* 顶部标题 */}
        <View className="mb-6">
          <Text className="block text-3xl font-bold text-slate-900 mb-2">软著采集表</Text>
          <Text className="block text-base text-slate-500">简洁高效的软件著作权登记工具</Text>
        </View>

        {/* 用户卡片 */}
        {userInfo ? (
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 shadow-xl mb-6">
            <CardContent className="p-6">
              <View className="flex items-center justify-between">
                <View className="flex items-center gap-4">
                  <View className="w-16 h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                    {userInfo.avatar_url ? (
                      <Image src={userInfo.avatar_url} className="w-14 h-14 rounded-full" />
                    ) : (
                      <User size={32} color="#FFFFFF" />
                    )}
                  </View>
                  <View>
                    <Text className="block text-xl font-semibold text-white mb-1">
                      {userInfo.nickname || '用户'}
                    </Text>
                    <Text className="block text-sm text-white text-opacity-80">欢迎使用</Text>
                  </View>
                </View>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white hover:bg-opacity-10 px-3 py-2"
                  onClick={handleLogout}
                >
                  <Text className="text-sm">退出</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              <View className="flex flex-col items-center py-4">
                <View className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <User size={32} color="#3B82F6" />
                </View>
                <Text className="block text-base text-slate-600 mb-4">登录后开始使用</Text>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-8 py-6 text-base font-medium shadow-lg w-48"
                  onClick={handleWechatLogin}
                  disabled={loading}
                >
                  {loading ? '登录中...' : '微信登录'}
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 快捷操作区 */}
        {userInfo && (
          <View className="mb-6">
            <Text className="block text-lg font-semibold text-slate-900 mb-4">快捷操作</Text>
            <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <View
                  className="flex items-center justify-between p-6 border-b border-slate-100 active:bg-slate-50"
                  onClick={handleStartFill}
                >
                  <View className="flex items-center gap-4">
                    <View className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Plus size={24} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text className="block text-base font-medium text-slate-900">填写采集表</Text>
                      <Text className="block text-sm text-slate-500 mt-1">创建新的软著登记信息</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#94A3B8" />
                </View>

                <View
                  className="flex items-center justify-between p-6 active:bg-slate-50"
                  onClick={() => loadFormRecords(userInfo.id)}
                >
                  <View className="flex items-center gap-4">
                    <View className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <History size={24} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text className="block text-base font-medium text-slate-900">历史记录</Text>
                      <Text className="block text-sm text-slate-500 mt-1">查看已填写的采集表</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#94A3B8" />
                </View>
              </CardContent>
            </Card>
          </View>
        )}

        {/* 历史记录列表 */}
        {userInfo && formRecords.length > 0 && (
          <View className="mb-6">
            <View className="flex items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-slate-900">最近记录</Text>
              <Text className="text-sm text-slate-500">共 {formRecords.length} 条</Text>
            </View>
            
            {formRecords.map((record) => (
              <Card key={record.id} className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg mb-3">
                <CardContent className="p-4">
                  <View className="flex items-start justify-between">
                    <View className="flex-1">
                      <View className="flex items-center gap-2 mb-2">
                        <Text className="text-base font-medium text-slate-900">
                          {record.software_full_name}
                        </Text>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-xs">
                          {record.version}
                        </Badge>
                      </View>
                      <View className="flex items-center gap-2 mb-2">
                        <View className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check size={10} color="#10B981" />
                      </View>
                        <Text className="text-sm text-slate-600">查询码：{record.query_code}</Text>
                      </View>
                      <Text className="text-xs text-slate-400">{formatDate(record.created_at)}</Text>
                    </View>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-600 px-3 py-2"
                      onClick={() => handleCopyQueryCode(record.query_code)}
                    >
                      <Copy size={16} color="#3B82F6" className="mr-1" />
                      <Text className="text-xs">复制</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        {/* 空状态 */}
        {userInfo && !recordsLoading && formRecords.length === 0 && (
          <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <View className="flex flex-col items-center">
                <View className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <FileText size={32} color="#94A3B8" />
                </View>
                <Text className="text-base text-slate-600 mb-2">暂无记录</Text>
                <Text className="text-sm text-slate-400 mb-4">开始填写您的第一份采集表</Text>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-6 py-3 text-sm"
                  onClick={handleStartFill}
                >
                  立即填写
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 底部说明 */}
        <View className="mt-8 mb-4">
          <Text className="block text-xs text-slate-400 text-center">
            © 2024 软著采集表 | 简洁高效的著作权登记工具
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
