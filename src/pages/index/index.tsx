import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, ChevronRight, FileText } from 'lucide-react-taro'
import './index.css'

export default function Index() {
  const handleStartFill = () => {
    Taro.navigateTo({ url: '/pages/form/index' })
  }

  return (
    <ScrollView className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <View className="px-4 py-6">
        {/* 顶部标题 */}
        <View className="mb-6">
          <Text className="block text-3xl font-bold text-slate-900 mb-2">软著采集表</Text>
          <Text className="block text-base text-slate-500">简洁高效的软件著作权登记工具</Text>
        </View>

        {/* 欢迎卡片 */}
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 shadow-xl mb-6">
          <CardContent className="p-6">
            <View className="flex items-center gap-4">
              <View className="w-14 h-14 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                <FileText size={28} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="block text-xl font-semibold text-white mb-1">
                  软件著作权登记
                </Text>
                <Text className="block text-sm text-white text-opacity-80">
                  填写信息，生成查询码
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 主操作区 */}
        <View className="mb-6">
          <Text className="block text-lg font-semibold text-slate-900 mb-4">开始使用</Text>
          <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-0">
              <View
                className="flex items-center justify-between p-6 active:bg-slate-50"
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
            </CardContent>
          </Card>
        </View>

        {/* 使用说明 */}
        <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <Text className="block text-base font-semibold text-slate-900 mb-4">使用说明</Text>
            <View className="gap-3">
              <View className="flex items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Text className="text-xs font-medium text-blue-600">1</Text>
                </View>
                <Text className="block text-sm text-slate-600 flex-1">点击&quot;填写采集表&quot;开始填写软件信息</Text>
              </View>
              <View className="flex items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Text className="text-xs font-medium text-blue-600">2</Text>
                </View>
                <Text className="block text-sm text-slate-600 flex-1">提交后获得唯一查询码</Text>
              </View>
              <View className="flex items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Text className="text-xs font-medium text-blue-600">3</Text>
                </View>
                <Text className="block text-sm text-slate-600 flex-1">在网页端输入查询码生成文档</Text>
              </View>
            </View>
          </CardContent>
        </Card>

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
