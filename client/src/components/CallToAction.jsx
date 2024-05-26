import { Button } from 'flowbite-react'

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className='flex-1 justify-center flex flex-col '>
        <h2 className='text-2xl'>Want to watch anime?</h2>
        <p className='text-gray-500 my-2'>Checkout these resource with h!anime </p>
        <Button gradientMonochrome='teal' className='rounded-tl-xl rounded-bl-none'>
          <a href="https://hianime.to/" target='_blank' rel='noopener noreferrer'>Click to watch!</a>
        </Button>
      </div>
      <div className='p-7 flex-1'>
          <img src="https://external-preview.redd.it/aniwatch-is-being-rebranded-to-hianime-v0-dux8wjJ6FkXW56_79pGPrEN93xH4caD-G6k-GZZ7qXM.jpg?width=1080&crop=smart&auto=webp&s=3dca6b663fc4233eaa8f6874ac14b9c1416a874a" />
      </div>
    </div>
  )
}
