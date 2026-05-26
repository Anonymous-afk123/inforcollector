import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

interface WechatLoginDto {
  code: string; // 微信登录 code
  nickname?: string;
  avatar_url?: string;
}

@Controller('user')
export class UserController {
  
  /**
   * 微信登录接口
   * 注意：开发环境模拟登录，生产环境需要调用真实的微信 API
   */
  @Post('wechat-login')
  async wechatLogin(@Body() body: WechatLoginDto) {
    console.log('[UserController] 微信登录请求:', body);

    // TODO: 生产环境调用微信 API 获取 openid
    // const { data } = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`)
    // const openid = data.openid

    // 开发环境：使用 code 作为 openid（模拟）
    const openid = `dev_${body.code}_${Date.now()}`;

    const client = getSupabaseClient();

    // 查询用户是否存在
    const { data: existingUser, error: queryError } = await client
      .from('users')
      .select('*')
      .eq('openid', openid)
      .maybeSingle();

    if (queryError) {
      console.error('[UserController] 查询用户失败:', queryError);
      throw new Error(`查询用户失败: ${queryError.message}`);
    }

    // 用户存在，直接返回
    if (existingUser) {
      console.log('[UserController] 用户已存在:', existingUser.id);
      return {
        code: 200,
        msg: '登录成功',
        data: {
          user: existingUser,
          token: `mock_token_${existingUser.id}`, // 生产环境应生成真实 JWT
        },
      };
    }

    // 用户不存在，创建新用户
    const { data: newUser, error: createError } = await client
      .from('users')
      .insert({
        openid,
        nickname: body.nickname || '微信用户',
        avatar_url: body.avatar_url || '',
      })
      .select()
      .single();

    if (createError) {
      console.error('[UserController] 创建用户失败:', createError);
      throw new Error(`创建用户失败: ${createError.message}`);
    }

    console.log('[UserController] 创建新用户成功:', newUser.id);
    return {
      code: 200,
      msg: '注册成功',
      data: {
        user: newUser,
        token: `mock_token_${newUser.id}`, // 生产环境应生成真实 JWT
      },
    };
  }

  /**
   * 获取用户信息
   */
  @Get('info')
  async getUserInfo(@Query('user_id') userId: string) {
    console.log('[UserController] 获取用户信息:', userId);

    const client = getSupabaseClient();

    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[UserController] 查询用户失败:', error);
      throw new Error(`查询用户失败: ${error.message}`);
    }

    if (!user) {
      return {
        code: 404,
        msg: '用户不存在',
        data: null,
      };
    }

    return {
      code: 200,
      msg: '获取成功',
      data: user,
    };
  }
}
