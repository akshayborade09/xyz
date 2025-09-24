'use client';

import { Button } from '@/components/ui/button';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { useToast } from '@/hooks/use-toast';

export default function ModelsOverviewPage() {
  const { toast } = useToast();

  const codeSnippet = `import requests
url = "https://api.krutrim.ai/v1/chat/completions"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
data = {
  "model": "gpt-5",
  "messages": [{"role": "user", "content": "Hello, AI assistant!"}]
}
response = requests.post(url, headers=headers, json=data)
print(response.json())`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      toast({
        title: "Starter code copied",
        description: "The code snippet has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyModelId = async (modelId: string) => {
    try {
      await navigator.clipboard.writeText(modelId);
      toast({
        title: "Model ID copied",
        description: `${modelId} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='space-y-6'>
      {/* Hero Section */}
      <div 
        className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[500px] px-6 lg:px-12 py-12 rounded-2xl relative overflow-hidden'
        style={{
          backgroundColor: '#F3F8FF',
        }}
      >
        {/* Background SVG Pattern */}
        <div className='absolute inset-0 opacity-100'>
          <svg 
            className='w-full h-full object-cover' 
            viewBox="0 0 1232 640" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <g clipPath="url(#clip0_646_2612)">
              <rect width="1232" height="640" fill="#F3F8FF"/>
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M929.704 412C928.178 412 927.047 410.582 927.387 409.094L933.471 382.466C933.811 380.979 932.681 379.561 931.155 379.561H853.876C853.18 379.561 852.519 379.256 852.068 378.726L733.568 239.754C732.811 238.866 732.811 237.559 733.568 236.671L850.74 99.2564C851.192 98.727 851.852 98.422 852.548 98.422H941.134C943.161 98.422 944.258 100.797 942.942 102.34L828.4 236.671C827.642 237.559 827.642 238.866 828.4 239.754L933.912 363.495C935.181 364.982 937.602 364.388 938.037 362.483L1005.58 66.847C1005.83 65.7664 1006.79 65 1007.9 65H1072.45C1073.97 65 1075.1 66.4179 1074.76 67.9056L1068.46 95.5164C1068.12 97.0041 1069.25 98.422 1070.77 98.422H1150.65C1151.35 98.422 1152.01 98.727 1152.46 99.2564L1269.63 236.671C1270.39 237.559 1270.39 238.866 1269.63 239.754L1151.13 378.726C1150.68 379.256 1150.02 379.561 1149.32 379.561H1131.57L1060.85 379.42C1058.83 379.416 1057.73 377.043 1059.05 375.502L1174.8 239.754C1175.56 238.866 1175.56 237.559 1174.8 236.671L1068.56 112.083C1067.3 110.596 1064.87 111.19 1064.44 113.095L996.567 410.153C996.32 411.234 995.359 412 994.251 412H929.704Z" 
                fill="#DBEFFF"
              />
            </g>
            <defs>
              <clipPath id="clip0_646_2612">
                <rect width="1232" height="640" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
        
        {/* Left Side - Content */}
        <div className='space-y-6 relative z-10'>
          {/* Heading */}
          <h1 className='text-3xl lg:text-4xl font-bold tracking-tight text-foreground'>
            Access any AI model with one API.
          </h1>
          
          {/* Description */}
          <div className='space-y-2'>
            <p className='text-lg text-muted-foreground leading-snug'>
              Build anything with the top open and closed models.
            </p>
            <p className='text-lg text-muted-foreground leading-snug'>
              Track usage, manage access, and pay with Lightning credits.
            </p>
          </div>
          
          {/* CTAs */}
          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            <Button 
              size='lg' 
              className='bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8 py-3'
            >
              Get API key
            </Button>
            <Button 
              variant='outline' 
              size='lg'
              className='font-medium px-8 py-3 border-border hover:bg-accent hover:text-accent-foreground'
            >
              Request a model
            </Button>
          </div>
        </div>
        
        {/* Right Side - Code Example */}
        <div className='hidden lg:block relative z-10'>
          <div className='bg-gray-900 rounded-xl border border-gray-700 overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700'>
              <h3 className='text-sm font-medium text-gray-200'>Try it now</h3>
              <TooltipWrapper content="Copy code">
                <button 
                  onClick={handleCopyCode}
                  className='p-1 hover:bg-gray-700 rounded transition-colors'
                >
                  <svg className='w-4 h-4 text-gray-400 hover:text-gray-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                  </svg>
                </button>
              </TooltipWrapper>
            </div>
            
            {/* Code Content */}
            <div className='p-4 bg-gray-900'>
              <pre className='text-sm text-gray-300 leading-relaxed overflow-x-auto'>
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Models Section */}
      <div className='space-y-6'>
        {/* Section Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-foreground'>Featured Models</h2>
            <p className='text-muted-foreground mt-1'>New and noteworthy models hosted by Krutrim</p>
          </div>
          <Button variant='outline' className='hidden sm:flex'>
            View all models
          </Button>
        </div>

        {/* Model Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Card 1 - OpenAI GPT-OSS 20B */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 space-y-4'>
            {/* Provider Logo */}
            <div className='flex justify-start mb-4'>
              <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200'>
                <span className='text-lg font-bold text-gray-700'>O</span>
              </div>
            </div>

            {/* Model ID with Copy */}
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-semibold text-gray-900'>openai/gpt-oss-20b</h3>
                <TooltipWrapper content="Copy model ID">
                  <button 
                    onClick={() => handleCopyModelId('openai/gpt-oss-20b')}
                    className='p-1 hover:bg-gray-100 rounded transition-colors'
                  >
                    <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                    </svg>
                  </button>
                </TooltipWrapper>
              </div>
              <p className='text-sm text-gray-600'>Large-scale GPT model with 20B parameters</p>
            </div>

            {/* Spacing before pricing */}
            <div className='pt-4'></div>

            {/* Pricing */}
            <div className='space-y-1'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-semibold text-gray-900'>$0.05</span>
                <span className='text-lg font-semibold text-gray-900'>$0.20</span>
              </div>
              <div className='flex items-center justify-between text-xs text-gray-500'>
                <span>Per 1M Input Tokens</span>
                <span>Per 1M Output Tokens</span>
              </div>
            </div>

            {/* Tags */}
            <div className='flex flex-wrap gap-2'>
              <span className='px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded font-medium'>120B</span>
              <span className='px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded font-medium'>128K</span>
              <span className='px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded font-medium'>Reasoning</span>
            </div>

            {/* Action Buttons */}
            <div className='flex space-x-3 pt-2'>
              <Button className='flex-1'>
                Playground
              </Button>
              <Button variant='outline' size='sm' className='px-3'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' />
                </svg>
              </Button>
            </div>
          </div>

          {/* Card 2 - Kimi K2-Instruct */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 space-y-4'>
            {/* Provider Logo */}
            <div className='flex justify-start mb-4'>
              <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200'>
                <span className='text-lg font-bold text-gray-700'>M</span>
              </div>
            </div>

            {/* Model ID with Copy */}
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-semibold text-gray-900'>moonshotai/Kimi-K2-Instruct-0905</h3>
                <TooltipWrapper content="Copy model ID">
                  <button 
                    onClick={() => handleCopyModelId('moonshotai/Kimi-K2-Instruct-0905')}
                    className='p-1 hover:bg-gray-100 rounded transition-colors'
                  >
                    <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                    </svg>
                  </button>
                </TooltipWrapper>
              </div>
              <p className='text-sm text-gray-600'>Advanced instruction-following model for conversations</p>
            </div>

            {/* Spacing before pricing */}
            <div className='pt-4'></div>

            {/* Pricing */}
            <div className='space-y-1'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-semibold text-gray-900'>$1.00</span>
                <span className='text-lg font-semibold text-gray-900'>$3.00</span>
              </div>
              <div className='flex items-center justify-between text-xs text-gray-500'>
                <span>Per 1M Input Tokens</span>
                <span>Per 1M Output Tokens</span>
              </div>
            </div>

            {/* Tags */}
            <div className='flex flex-wrap gap-2'>
              <span className='px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded font-medium'>32K</span>
              <span className='px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded font-medium'>Chat</span>
              <span className='px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded font-medium'>Instruct</span>
            </div>

            {/* Action Buttons */}
            <div className='flex space-x-3 pt-2'>
              <Button className='flex-1'>
                Playground
              </Button>
              <Button variant='outline' size='sm' className='px-3'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' />
                </svg>
              </Button>
            </div>
          </div>

          {/* Card 3 - Qwen3 Next */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 space-y-4'>
            {/* Provider Logo */}
            <div className='flex justify-start mb-4'>
              <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200'>
                <span className='text-lg font-bold text-gray-700'>Q</span>
              </div>
            </div>

            {/* Model ID with Copy */}
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-semibold text-gray-900'>Qwen/Qwen3-Next-80B-A3B-Instruct</h3>
                <TooltipWrapper content="Copy model ID">
                  <button 
                    onClick={() => handleCopyModelId('Qwen/Qwen3-Next-80B-A3B-Instruct')}
                    className='p-1 hover:bg-gray-100 rounded transition-colors'
                  >
                    <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                    </svg>
                  </button>
                </TooltipWrapper>
              </div>
              <p className='text-sm text-gray-600'>Next-generation 80B model with enhanced reasoning</p>
            </div>

            {/* Spacing before pricing */}
            <div className='pt-4'></div>

            {/* Pricing */}
            <div className='space-y-1'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-semibold text-gray-900'>$0.15</span>
                <span className='text-lg font-semibold text-gray-900'>$1.50</span>
              </div>
              <div className='flex items-center justify-between text-xs text-gray-500'>
                <span>Per 1M Input Tokens</span>
                <span>Per 1M Output Tokens</span>
              </div>
            </div>

            {/* Tags */}
            <div className='flex flex-wrap gap-2'>
              <span className='px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded font-medium'>80B</span>
              <span className='px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded font-medium'>32K</span>
              <span className='px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded font-medium'>Instruct</span>
            </div>

            {/* Action Buttons */}
            <div className='flex space-x-3 pt-2'>
              <Button className='flex-1'>
                Playground
              </Button>
              <Button variant='outline' size='sm' className='px-3'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}