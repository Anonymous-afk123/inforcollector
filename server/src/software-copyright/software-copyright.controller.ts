import { Controller, Post, Body, Get, Put, Delete, Query, Param } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

interface CreateFormDto {
  user_id: string;
  software_full_name: string;
  software_short_name?: string;
  version: string;
  software_category: string;
  development_date: string;
  is_published: boolean;
  development_hardware: string;
  runtime_hardware: string;
  development_os: string;
  development_tools: string;
  runtime_platform: string;
  runtime_environment: string;
  programming_language: string;
  source_code_lines: number;
  development_purpose: string;
  target_industry: string;
  main_functions: string;
  technical_features: string;
  company_name: string;
  credit_code: string;
}

@Controller('software-copyright')
export class SoftwareCopyrightController {
  
  /**
   * 创建软著申请表
   */
  @Post('form')
  async createForm(@Body() body: CreateFormDto) {
    console.log('[SoftwareCopyrightController] 创建软著申请表:', body);

    // 生成查询码：RJ + 日期 + 随机数（例如：RJ20240519001）
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const queryCode = `RJ${dateStr}${randomNum}`;

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('software_copyright_forms')
      .insert({
        ...body,
        query_code: queryCode,
      })
      .select()
      .single();

    if (error) {
      console.error('[SoftwareCopyrightController] 创建失败:', error);
      throw new Error(`创建失败: ${error.message}`);
    }

    console.log('[SoftwareCopyrightController] 创建成功:', data.id, '查询码:', queryCode);
    return {
      code: 200,
      msg: '创建成功',
      data,
    };
  }

  /**
   * 获取用户的软著申请表列表
   */
  @Get('forms')
  async getForms(@Query('user_id') userId: string) {
    console.log('[SoftwareCopyrightController] 获取申请表列表:', userId);

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('software_copyright_forms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SoftwareCopyrightController] 查询失败:', error);
      throw new Error(`查询失败: ${error.message}`);
    }

    return {
      code: 200,
      msg: '获取成功',
      data: data || [],
    };
  }

  /**
   * 获取单个软著申请表详情
   */
  @Get('form/:id')
  async getForm(@Param('id') id: string) {
    console.log('[SoftwareCopyrightController] 获取申请表详情:', id);

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('software_copyright_forms')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[SoftwareCopyrightController] 查询失败:', error);
      throw new Error(`查询失败: ${error.message}`);
    }

    if (!data) {
      return {
        code: 404,
        msg: '申请表不存在',
        data: null,
      };
    }

    return {
      code: 200,
      msg: '获取成功',
      data,
    };
  }

  /**
   * 通过查询码查询软著申请表（网页端使用）
   */
  @Get('query/:code')
  async queryByCode(@Param('code') code: string) {
    console.log('[SoftwareCopyrightController] 通过查询码查询:', code);

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('software_copyright_forms')
      .select('*')
      .eq('query_code', code.toUpperCase())
      .maybeSingle();

    if (error) {
      console.error('[SoftwareCopyrightController] 查询失败:', error);
      throw new Error(`查询失败: ${error.message}`);
    }

    if (!data) {
      return {
        code: 404,
        msg: '查询码不存在或已过期',
        data: null,
      };
    }

    console.log('[SoftwareCopyrightController] 查询成功:', data.id);
    return {
      code: 200,
      msg: '查询成功',
      data,
    };
  }

  /**
   * 更新软著申请表
   */
  @Put('form/:id')
  async updateForm(@Param('id') id: string, @Body() body: Partial<CreateFormDto>) {
    console.log('[SoftwareCopyrightController] 更新申请表:', id, body);

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('software_copyright_forms')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[SoftwareCopyrightController] 更新失败:', error);
      throw new Error(`更新失败: ${error.message}`);
    }

    console.log('[SoftwareCopyrightController] 更新成功:', data.id);
    return {
      code: 200,
      msg: '更新成功',
      data,
    };
  }

  /**
   * 删除软著申请表
   */
  @Delete('form/:id')
  async deleteForm(@Param('id') id: string) {
    console.log('[SoftwareCopyrightController] 删除申请表:', id);

    const client = getSupabaseClient();

    const { error } = await client
      .from('software_copyright_forms')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[SoftwareCopyrightController] 删除失败:', error);
      throw new Error(`删除失败: ${error.message}`);
    }

    console.log('[SoftwareCopyrightController] 删除成功:', id);
    return {
      code: 200,
      msg: '删除成功',
      data: null,
    };
  }
}
