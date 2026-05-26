export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '软著信息采集表',
    })
  : { navigationBarTitleText: '软著信息采集表' }
