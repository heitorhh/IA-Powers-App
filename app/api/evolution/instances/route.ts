import { NextRequest, NextResponse } from 'next/server'
import { evolutionAPI } from '@/lib/evolution-api'

export async function GET() {
  try {
    // Verificar se a API está funcionando
    const isHealthy = await evolutionAPI.healthCheck()
    
    if (!isHealthy) {
      return NextResponse.json(
        { error: 'Evolution API is not available' },
        { status: 503 }
      )
    }

    const instances = evolutionAPI.getAllInstances()
    
    return NextResponse.json({
      success: true,
      instances,
      count: instances.length
    })
  } catch (error) {
    console.error('Error fetching instances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instances' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { instanceName } = await request.json()

    if (!instanceName) {
      return NextResponse.json(
        { error: 'Instance name is required' },
        { status: 400 }
      )
    }

    // Verificar se a API está funcionando
    const isHealthy = await evolutionAPI.healthCheck()
    
    if (!isHealthy) {
      return NextResponse.json(
        { error: 'Evolution API is not available. Please check Railway deployment.' },
        { status: 503 }
      )
    }

    const instance = await evolutionAPI.createInstance(instanceName)
    
    return NextResponse.json({
      success: true,
      instance,
      message: 'Instance created successfully'
    })
  } catch (error) {
    console.error('Error creating instance:', error)
    
    // Retornar erro mais específico
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create instance' },
      { status: 500 }
    )
  }
}
