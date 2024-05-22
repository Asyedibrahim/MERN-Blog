import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitterX } from 'react-icons/bs'


export default function FooterCon() {
  return (
    <Footer container className='border border-teal-500 border-t-8'>
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">

                <div className="mt-5">
                    <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                        <span className='px-2 py-1 bg-gradient-to-br from-green-400 to-cyan-600 rounded-lg text-white'>JoyBoy's</span>Blog
                    </Link>
                    <p className='text-slate-500 mt-3 sm:ml-3'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto, fuga! <br />Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum, libero?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                    <div>
                        <Footer.Title title='About'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='https://www.100jsprojects.com' target='_blank' rel='noopener noreferrer'>
                                100 js projects
                            </Footer.Link>
                            <Footer.Link href='/about' target='_blank' rel='noopener noreferrer'>
                                JoyBoy's Blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Follow us'/>
                            <Footer.LinkGroup col>
                                <Footer.Link href='https://www.github.com/asyedibrahim' target='_blank' rel='noopener noreferrer'>
                                    GitHub
                                </Footer.Link>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                    Discord
                                </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Legal'/>
                            <Footer.LinkGroup col>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                    Terms  &amp; Conditions
                                </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>

            </div>
            <Footer.Divider />
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright href='#' by="JoyBoy's Blog" year={new Date().getFullYear()}/>
                <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                    <Footer.Icon target='_blank' href='#'  icon={BsFacebook}/>
                    <Footer.Icon target='_blank' href='#' icon={BsInstagram}/>
                    <Footer.Icon target='_blank' href='#' icon={BsTwitterX}/>
                    <Footer.Icon target='_blank' href='https://www.github.com/asyedibrahim' icon={BsGithub}/>
                    <Footer.Icon target='_blank' href='#' icon={BsDribbble}/>
                </div>
            </div>
        </div>
    </Footer>
  )
}
