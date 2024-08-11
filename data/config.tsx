import { Button } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { NextSeoProps } from 'next-seo'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { Logo } from './logo'

const siteConfig = {
  logo: Logo,
  seo: {
    title: 'Gemini Toolkit',
    description: 'The Next Level AI',
  } as NextSeoProps,
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: '',
        label: '',
      },
      // {
      //   label: 'Login',
      //   href: '/login',
      // },
      {
        label: 'Sign In',
        href: '/signup',
        variant: 'primary',
      },
    ],
  },
  footer: {
    copyright: (
      <>
        Powered By Gemini
      </>
    ),
    links: [
      {
        href: 'https://github.com/Saigenix/gemini-toolkit',
        label: 'Contact',
      },
      {
        href: 'https://github.com/Saigenix/gemini-toolkit',
        label: <FaGithub size="14" />,
      },
    ],
  },
  signup: {
    title: 'Create Your AI Tools with Gemini Toolkit',
    features: [
      {
        icon: FiCheck,
        title: 'Custom AI Tool Creation',
        description: 'Easily create text-based and image-based AI tools with Gemini Toolkit.',
      },
      {
        icon: FiCheck,
        title: 'Advanced Tool Management',
        description: 'Manage, use, share, like, and save your tools effortlessly.',
      },
      {
        icon: FiCheck,
        title: 'Integrated AI Chatbot',
        description: 'Get quick support and info through our on-site AI chatbot.',
      },
    ],
  },
}

export default siteConfig



