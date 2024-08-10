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
        href: '#',
        label: 'Contact',
      },
      // {
      //   href: '#',
      //   label: <FaTwitter size="14" />,
      // },
      {
        href: '#',
        label: <FaGithub size="14" />,
      },
    ],
  },
  signup: {
    title: 'Create Your AI Tools with Gemini Toolkit',
    features: [
      {
        icon: FiCheck,
        title: 'User-Friendly Interface',
        description: 'Easily navigate and build with a straightforward, intuitive design.',
      },
      {
        icon: FiCheck,
        title: 'Customizable Templates',
        description: 'Tailor your AI tools with flexible templates to meet your specific needs.',
      },
      {
        icon: FiCheck,
        title: 'Seamless API Integration',
        description: 'Effortlessly connect with the Gemini API for advanced AI functionalities.',
      },
    ],
  },
}

export default siteConfig



