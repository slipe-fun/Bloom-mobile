import { useRouter } from 'expo-router'

interface UseAuthFooter {
  handlePress: () => void
}

export default function useAuthFooter(): UseAuthFooter {
  const router = useRouter()

  const handlePress = () => router.navigate('/(auth)/Success')

  return { handlePress }
}
