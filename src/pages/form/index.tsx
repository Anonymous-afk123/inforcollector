import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Network } from '@/network'
import { ChevronLeft, Copy, Info, Check } from 'lucide-react-taro'
import './index.css'

interface FormData {
  software_full_name: string
  software_short_name: string
  version: string
  software_category: string
  development_date: string
  is_published: boolean
  development_hardware: string
  runtime_hardware: string
  development_os: string
  development_tools: string
  runtime_platform: string
  runtime_environment: string
  programming_language: string
  source_code_lines: number
  development_purpose: string
  target_industry: string
  main_functions: string
  technical_features: string
  company_name: string
  credit_code: string
}

const initialFormData: FormData = {
  software_full_name: '',
  software_short_name: '',
  version: 'V1.0',
  software_category: '',
  development_date: '',
  is_published: false,
  development_hardware: 'PC机',
  runtime_hardware: 'PC机',
  development_os: 'Windows 10',
  development_tools: '',
  runtime_platform: 'Windows 10',
  runtime_environment: '',
  programming_language: '',
  source_code_lines: 0,
  development_purpose: '',
  target_industry: '',
  main_functions: '',
  technical_features: '',
  company_name: '',
  credit_code: '',
}

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [queryCode, setQueryCode] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateProgress = () => {
    const requiredFields = [
      'software_full_name',
      'version',
      'software_category',
      'development_date',
      'development_tools',
      'runtime_environment',
      'programming_language',
      'source_code_lines',
      'development_purpose',
      'target_industry',
      'main_functions',
      'technical_features',
      'company_name',
      'credit_code',
    ]

    const filledCount = requiredFields.filter((field) => {
      const value = formData[field as keyof FormData]
      return value && value !== '' && value !== 0
    }).length

    return Math.round((filledCount / requiredFields.length) * 100)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await Network.request({
        url: '/api/software-copyright/form',
        method: 'POST',
        data: formData,
      })

      if (response.data?.code === 200) {
        const code = response.data.data.query_code
        setQueryCode(code)
        setShowSuccess(true)
        Taro.showToast({ title: '提交成功', icon: 'success' })
      } else {
        Taro.showToast({ title: response.data?.msg || '提交失败', icon: 'error' })
      }
    } catch (error) {
      console.error('提交失败:', error)
      Taro.showToast({ title: '提交失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyQueryCode = () => {
    Taro.setClipboardData({
      data: queryCode,
      success: () => {
        Taro.showToast({ title: '已复制查询码', icon: 'success' })
      },
    })
  }

  const handleBack = () => {
    if (showSuccess) {
      Taro.navigateBack()
    } else {
      Taro.showModal({
        title: '提示',
        content: '确定要离开吗？已填写的内容将不会保存',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateBack()
          }
        },
      })
    }
  }

  const progress = calculateProgress()

  return (
    <View className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* 顶部导航 */}
      <View className="bg-white bg-opacity-90 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <View className="flex items-center justify-between px-4 py-4">
          <View className="flex items-center gap-3" onClick={handleBack}>
            <ChevronLeft size={24} color="#334155" />
            <Text className="text-lg font-medium text-slate-900">返回</Text>
          </View>
          <Text className="text-lg font-semibold text-slate-900">软著采集表</Text>
          <View className="w-16" />
        </View>

        {/* 进度条 */}
        {!showSuccess && (
          <View className="px-4 pb-4">
            <View className="flex items-center justify-between mb-2">
              <Text className="text-sm text-slate-600">填写进度</Text>
              <Text className="text-sm font-medium text-blue-600">{progress}%</Text>
            </View>
            <Progress value={progress} className="h-2 bg-slate-200" />
          </View>
        )}
      </View>

      {/* 成功页面 */}
      {showSuccess && (
        <ScrollView className="px-4 py-8">
          <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardContent className="p-8">
              <View className="flex flex-col items-center">
                <View className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
                  <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Check size={24} color="#10B981" />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-slate-900 mb-2">提交成功！</Text>
                <Text className="text-base text-slate-600 mb-6 text-center">
                  您的采集表已成功提交
                </Text>

                <View className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
                  <Text className="block text-sm text-slate-600 mb-2">查询码</Text>
                  <View className="flex items-center justify-between">
                    <Text className="text-2xl font-bold text-blue-600">{queryCode}</Text>
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-600 px-4 py-2"
                      onClick={handleCopyQueryCode}
                    >
                      <Copy size={16} color="#3B82F6" className="mr-1" />
                      <Text className="text-sm">复制</Text>
                    </Button>
                  </View>
                </View>

                <View className="w-full bg-slate-50 rounded-xl p-4 mb-6">
                  <View className="flex items-start gap-3">
                    <Info size={20} color="#3B82F6" />
                    <View className="flex-1">
                      <Text className="block text-sm text-slate-700 mb-1">使用说明</Text>
                      <Text className="block text-xs text-slate-500 leading-relaxed">
                        请保存您的查询码，可在网页端输入查询码获取采集表信息并生成文档。
                      </Text>
                    </View>
                  </View>
                </View>

                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-8 py-3 text-base font-medium shadow-lg w-full"
                  onClick={handleBack}
                >
                  返回首页
                </Button>
              </View>
            </CardContent>
          </Card>
        </ScrollView>
      )}

      {/* 表单内容 */}
      {!showSuccess && (
        <ScrollView className="px-4 py-6 pb-32">
          {/* 基本信息 */}
          <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg mb-4">
            <CardHeader className="pb-3">
              <View className="flex items-center gap-2">
                <View className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Text className="text-sm font-semibold text-white">1</Text>
                </View>
                <CardTitle className="text-lg font-semibold text-slate-900">基本信息</CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="gap-2">
                <Label className="text-sm font-medium text-slate-700">软件全称</Label>
                <Input
                  className="bg-slate-50 border-slate-200"
                  placeholder="请输入软件全称"
                  value={formData.software_full_name}
                  onInput={(e) => handleInputChange('software_full_name', e.detail.value)}
                />
              </View>

              <View className="gap-2">
                <Label className="text-sm font-medium text-slate-700">软件简称</Label>
                <Input
                  className="bg-slate-50 border-slate-200"
                  placeholder="请输入软件简称"
                  value={formData.software_short_name}
                  onInput={(e) => handleInputChange('software_short_name', e.detail.value)}
                />
              </View>

              <View className="flex gap-4">
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">版本号</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="V1.0"
                    value={formData.version}
                    onInput={(e) => handleInputChange('version', e.detail.value)}
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">软件类别</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="应用软件"
                    value={formData.software_category}
                    onInput={(e) => handleInputChange('software_category', e.detail.value)}
                  />
                </View>
              </View>

              <View className="flex gap-4">
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">开发完成日期</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="2024-01-01"
                    value={formData.development_date}
                    onInput={(e) => handleInputChange('development_date', e.detail.value)}
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">是否发表</Label>
                  <View className="flex gap-2 mt-1">
                    <Badge
                      variant={!formData.is_published ? 'default' : 'secondary'}
                      className="px-3 py-1"
                      onClick={() => handleInputChange('is_published', false)}
                    >
                      未发表
                    </Badge>
                    <Badge
                      variant={formData.is_published ? 'default' : 'secondary'}
                      className="px-3 py-1"
                      onClick={() => handleInputChange('is_published', true)}
                    >
                      已发表
                    </Badge>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 开发环境 */}
          <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg mb-4">
            <CardHeader className="pb-3">
              <View className="flex items-center gap-2">
                <View className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Text className="text-sm font-semibold text-white">2</Text>
                </View>
                <CardTitle className="text-lg font-semibold text-slate-900">开发环境</CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="flex gap-4">
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">开发硬件</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="PC机"
                    value={formData.development_hardware}
                    onInput={(e) => handleInputChange('development_hardware', e.detail.value)}
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">运行硬件</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="PC机"
                    value={formData.runtime_hardware}
                    onInput={(e) => handleInputChange('runtime_hardware', e.detail.value)}
                  />
                </View>
              </View>

              <View className="flex gap-4">
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">开发操作系统</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="Windows 10"
                    value={formData.development_os}
                    onInput={(e) => handleInputChange('development_os', e.detail.value)}
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">开发工具</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="VS Code"
                    value={formData.development_tools}
                    onInput={(e) => handleInputChange('development_tools', e.detail.value)}
                  />
                </View>
              </View>

              <View className="flex gap-4">
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">运行平台</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="Windows 10"
                    value={formData.runtime_platform}
                    onInput={(e) => handleInputChange('runtime_platform', e.detail.value)}
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">运行环境</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="Node.js"
                    value={formData.runtime_environment}
                    onInput={(e) => handleInputChange('runtime_environment', e.detail.value)}
                  />
                </View>
              </View>

              <View className="flex gap-4">
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">编程语言</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    placeholder="JavaScript"
                    value={formData.programming_language}
                    onInput={(e) => handleInputChange('programming_language', e.detail.value)}
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Label className="text-sm font-medium text-slate-700">源代码行数</Label>
                  <Input
                    className="bg-slate-50 border-slate-200"
                    type="number"
                    placeholder="10000"
                    value={formData.source_code_lines.toString()}
                    onInput={(e) => handleInputChange('source_code_lines', parseInt(e.detail.value) || 0)}
                  />
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 功能说明 */}
          <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg mb-4">
            <CardHeader className="pb-3">
              <View className="flex items-center gap-2">
                <View className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                  <Text className="text-sm font-semibold text-white">3</Text>
                </View>
                <CardTitle className="text-lg font-semibold text-slate-900">功能说明</CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="gap-2">
                <Label className="text-sm font-medium text-slate-700">开发目的</Label>
                <Input
                  className="bg-slate-50 border-slate-200"
                  placeholder="请简要描述开发目的"
                  value={formData.development_purpose}
                  onInput={(e) => handleInputChange('development_purpose', e.detail.value)}
                />
              </View>

              <View className="gap-2">
                <Label className="text-sm font-medium text-slate-700">面向领域/行业</Label>
                <Input
                  className="bg-slate-50 border-slate-200"
                  placeholder="互联网、金融、医疗等"
                  value={formData.target_industry}
                  onInput={(e) => handleInputChange('target_industry', e.detail.value)}
                />
              </View>

              <View className="gap-2">
                <View className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700">主要功能</Label>
                  <Text className="text-xs text-slate-400">
                    {formData.main_functions.length}/1300 (最少500字)
                  </Text>
                </View>
                <View className="bg-slate-50 rounded-xl p-3">
                  <Textarea
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    className="min-h-40"
                    placeholder="请详细描述软件的主要功能（建议500-1300字符）"
                    maxlength={1300}
                    autoHeight
                    value={formData.main_functions}
                    onInput={(e) => handleInputChange('main_functions', e.detail.value)}
                  />
                </View>
              </View>

              <View className="gap-2">
                <Label className="text-sm font-medium text-slate-700">技术特点</Label>
                <View className="bg-slate-50 rounded-xl p-3">
                  <Textarea
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    className="min-h-24"
                    placeholder="请描述软件的技术特点和创新点"
                    autoHeight
                    value={formData.technical_features}
                    onInput={(e) => handleInputChange('technical_features', e.detail.value)}
                  />
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 企业信息 */}
          <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-lg mb-4">
            <CardHeader className="pb-3">
              <View className="flex items-center gap-2">
                <View className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                  <Text className="text-sm font-semibold text-white">4</Text>
                </View>
                <CardTitle className="text-lg font-semibold text-slate-900">企业信息</CardTitle>
              </View>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="gap-2">
                <Label className="text-sm font-medium text-slate-700">企业名称</Label>
                <Input
                  className="bg-slate-50 border-slate-200"
                  placeholder="请输入企业名称"
                  value={formData.company_name}
                  onInput={(e) => handleInputChange('company_name', e.detail.value)}
                />
              </View>

              <View className="gap-2">
                <Label className="text-sm font-medium text-slate-700">统一社会信用代码</Label>
                <Input
                  className="bg-slate-50 border-slate-200"
                  placeholder="请输入统一社会信用代码"
                  value={formData.credit_code}
                  onInput={(e) => handleInputChange('credit_code', e.detail.value)}
                />
              </View>
            </CardContent>
          </Card>
        </ScrollView>
      )}

      {/* 底部提交按钮 */}
      {!showSuccess && (
        <View
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderTop: '1px solid #E2E8F0',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Button
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full w-full py-6 text-base font-medium shadow-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '提交中...' : '提交采集表'}
          </Button>
        </View>
      )}
    </View>
  )
}
