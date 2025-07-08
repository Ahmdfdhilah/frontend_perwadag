import * as React from "react"
import { useInfiniteSearch } from "@/hooks/useInfiniteSearch"
import { userService, UserSearchResponse } from "@/services/userService"
import { Combobox } from "@workspace/ui/components/combobox"

interface InfiniteUserSearchProps {
  value?: string | number | null
  onChange: (value: string | number) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  onUserSelect?: (user: UserSearchResponse) => void
}

export function InfiniteUserSearch({
  value,
  onChange,
  placeholder = "Select user...",
  searchPlaceholder = "Search users...",
  className,
  onUserSelect
}: InfiniteUserSearchProps) {
  const searchUsers = React.useCallback(async (query: string, page: number, limit: number) => {
    if (!query || query.length < 2) {
      return { data: [], hasMore: false, total: 0 }
    }

    try {
      const response = await userService.searchUsers(query, { page, size: limit })
      
      return {
        data: response.items,
        hasMore: page < response.pages,
        total: response.total
      }
    } catch (error) {
      console.error('Error searching users:', error)
      return { data: [], hasMore: false, total: 0 }
    }
  }, [])

  const {
    data: users,
    loading,
    loadingMore,
    error,
    hasMore,
    query,
    setQuery,
    loadMore
  } = useInfiniteSearch({
    searchFn: searchUsers,
    limit: 20,
    debounceMs: 300
  })

  const options = React.useMemo(() => {
    return users.map(user => ({
      value: user.id,
      label: user.name,
      description: `${user.employee_id ? user.employee_id : ''}${user.employee_id && user.org_unit_name ? ' • ' : ''}${user.org_unit_name ? user.org_unit_name : ''}`
    }))
  }, [users])

  const handleChange = React.useCallback((selectedValue: string | number) => {
    const selectedUser = users.find(user => user.id === selectedValue)
    if (selectedUser && onUserSelect) {
      onUserSelect(selectedUser)
    }
    onChange(selectedValue)
  }, [users, onUserSelect, onChange])

  return (
    <div className={className}>
      <Combobox
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        searchValue={query}
        onSearchChange={setQuery}
        isLoading={loading}
        enableInfiniteScroll={true}
        onLoadMore={loadMore}
        hasNextPage={hasMore}
        isLoadingMore={loadingMore}
        emptyMessage={query.length < 2 ? "Type at least 2 characters to search" : "No users found"}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          totalItems: users.length,
          hasNextPage: hasMore
        }}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}