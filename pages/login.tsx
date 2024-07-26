import { Center } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { BackgroundGradient } from 'components/gradients/background-gradient'
import { PageTransition } from 'components/motion/page-transition'
import { Section } from 'components/section'
import { NextPage } from 'next'
import { FaGithub, FaGoogle } from 'react-icons/fa'


const Login: NextPage = () => {
  return (
    <Section height="calc(100vh - 200px)" innerWidth="container.sm">
      <BackgroundGradient zIndex="-1" />
      <Center height="100%" pt="20">
        <PageTransition width="100%">
        </PageTransition>
      </Center>
    </Section>
  )
}

export default Login
