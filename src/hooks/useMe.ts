import getMyUserRequest from '@api/lib/users/getMyUserRequest'
import type { User } from '@interfaces'
import { useQuery } from '@tanstack/react-query'

interface useMe {
  loading: boolean
  error: string
  user: User | undefined
}

export default function useMe(): useMe {
  const { data, error, isPending } = useQuery<User>({
    queryKey: ['me'],
    queryFn: getMyUserRequest,
  })

  return { loading: isPending, error: error ? error.message : '', user: data }
}
