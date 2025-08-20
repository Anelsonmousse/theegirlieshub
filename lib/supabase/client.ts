export const supabase = {
  from: (table: string) => ({
    select: (columns?: string, options?: { count?: string }) => {
      const query = {
        eq: (column: string, value: any) => {
          return Promise.resolve({
            data: [],
            error: null,
            count: options?.count === "exact" ? 0 : undefined,
          })
        },
        order: (column: string, orderOptions?: { ascending?: boolean }) => {
          return {
            range: (from: number, to: number) => {
              return Promise.resolve({
                data: [],
                error: null,
                count: options?.count === "exact" ? 0 : undefined,
              })
            },
            eq: (column: string, value: any) => {
              return Promise.resolve({
                data: [],
                error: null,
                count: options?.count === "exact" ? 0 : undefined,
              })
            },
          }
        },
        range: (from: number, to: number) => {
          return Promise.resolve({
            data: [],
            error: null,
            count: options?.count === "exact" ? 0 : undefined,
          })
        },
        single: () => Promise.resolve({ data: null, error: null }),
      }
      return query
    },
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
  }),
}

export const isSupabaseConfigured = true
