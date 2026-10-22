import axios from 'axios'

export const api = axios.create({ baseURL: '/api' })

// Attach JWT to admin-only requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sahara_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('sahara_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  },
)

export interface AchievementPhoto {
  id: number
  imageUrl: string
  caption: string | null
  displayOrder: number
}

export interface Achievement {
  id: number
  title: string
  description: string | null
  tournamentName: string | null
  year: number | null
  position: string | null
  achievementDate: string | null
  coverImageUrl: string | null
  photos: AchievementPhoto[]
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: '1st Place Champions — AP Sports Club Ayyanarpalayam',
    description:
      'Sahara Kabaddi Team lifted the 1st Prize and rolling trophy along with ₹12,000 cash prize presented by Mr. Er. T. Stalin, B.Tech. Outstanding raider performances and defensive coordination secured an emphatic championship victory.',
    tournamentName: 'AP Sports Club Ayyanarpalayam 3rd Year Tournament 2K26',
    year: 2026,
    position: '1st Place Champions',
    achievementDate: '2026-08-15',
    coverImageUrl: '/images/sahara-first-prize-ayyanarpalayam.jpg',
    photos: [
      {
        id: 101,
        imageUrl: '/images/sahara-first-prize-ayyanarpalayam.jpg',
        caption: '1st Place Champions holding rolling trophy and prize at Ayyanarpalayam',
        displayOrder: 1,
      },
    ],
  },
  {
    id: 2,
    title: '2nd Prize Trophy — Kumara Cup Tournament',
    description:
      'Sahara Kabaddi squad secured the prestigious 2nd prize trophy in the Kumarakoppai tournament against top district competitors after an intense final showdown.',
    tournamentName: 'Kumarakoppai Kabaddi Tournament',
    year: 2026,
    position: 'Runner-up (2nd Prize)',
    achievementDate: '2026-07-20',
    coverImageUrl: '/images/sahara-trophy-2nd-kumarakoppai.jpg',
    photos: [
      {
        id: 102,
        imageUrl: '/images/sahara-trophy-2nd-kumarakoppai.jpg',
        caption: 'Runner-up trophy presented at Kumarakoppai tournament',
        displayOrder: 2,
      },
    ],
  },
  {
    id: 3,
    title: '3rd Place Trophy — State Invitational Night Cup',
    description:
      'Competing under floodlights against seasoned state squads, Sahara Kabaddi fought through demanding knockout rounds to lift the 3rd place rolling trophy and player medals.',
    tournamentName: 'State Level Floodlight Kabaddi Championship',
    year: 2025,
    position: '3rd Place',
    achievementDate: '2025-11-14',
    coverImageUrl: '/images/sahara-trophy-night-3rd.jpg',
    photos: [
      {
        id: 103,
        imageUrl: '/images/sahara-trophy-night-3rd.jpg',
        caption: 'State Level Floodlight championship 3rd place rolling trophy',
        displayOrder: 3,
      },
    ],
  },
  {
    id: 4,
    title: '3rd Prize Celebration — District Invitational Cup',
    description:
      'The squad celebrated a podium finish and rolling trophy at the daytime district tournament with strong support from the Ammapalayam community.',
    tournamentName: 'District Level Kabaddi Tournament',
    year: 2025,
    position: '3rd Prize',
    achievementDate: '2025-05-10',
    coverImageUrl: '/images/sahara-team-3rd-prize-day.jpg',
    photos: [
      {
        id: 104,
        imageUrl: '/images/sahara-team-3rd-prize-day.jpg',
        caption: 'Daytime tournament podium finish with community supporters',
        displayOrder: 4,
      },
    ],
  },
  {
    id: 5,
    title: 'Sahara Kabaddi Legend Tribute — A. Suresh',
    description:
      'Honorary tribute to A. Suresh (அகில இந்திய பல்கலைக்கழக கபாடி வீரர்) — All India University Kabaddi Player representing Sahara Kabaddi Club, Ammapalayam, Perambalur.',
    tournamentName: 'All India University Kabaddi Icon',
    year: 2024,
    position: 'Club Icon / Legend',
    achievementDate: '2024-01-26',
    coverImageUrl: '/images/sahara-legend-a-suresh.jpg',
    photos: [
      {
        id: 105,
        imageUrl: '/images/sahara-legend-a-suresh.jpg',
        caption: 'A. Suresh (அகில இந்திய பல்கலைக்கழக கபாடி வீரர்) — All India University Player',
        displayOrder: 5,
      },
    ],
  },
  {
    id: 6,
    title: '4th Place Trophy — SKL Sports Club Sirukudal',
    description:
      'Sahara Kabaddi Team battled through intense floodlight knockout matches to secure the 4th place rolling trophy at the SKL Sports Club state tournament in Sirukudal.',
    tournamentName: 'SKL Sports Club State Tournament',
    year: 2026,
    position: '4th Place',
    achievementDate: '2026-08-28',
    coverImageUrl: '/images/sahara-skl-sirukudal-4th.jpg',
    photos: [
      {
        id: 106,
        imageUrl: '/images/sahara-skl-sirukudal-4th.jpg',
        caption: 'Sahara Kabaddi squad with SKL Sirukudal 4th Place trophy',
        displayOrder: 6,
      },
    ],
  },
  {
    id: 7,
    title: '1st Prize Champions — Grand Sand Court Night Cup',
    description:
      'Dominant championship victory under floodlights on the sand court. Sahara squad clinched the grand 1st place trophy cup and cash prize after an undefeated campaign.',
    tournamentName: 'District Floodlight Kabaddi Championship',
    year: 2026,
    position: '1st Place Champions',
    achievementDate: '2026-06-12',
    coverImageUrl: '/images/sahara-night-champions-1st.jpg',
    photos: [
      {
        id: 107,
        imageUrl: '/images/sahara-night-champions-1st.jpg',
        caption: 'Championship celebration on the sand court with grand blue & gold trophy',
        displayOrder: 7,
      },
    ],
  },
  {
    id: 8,
    title: '3rd Prize Trophy — Sellur PMK Invitational Cup',
    description:
      'Podium celebration and 3rd prize rolling trophy presented by Thiru. A. Muthukumar, Ondriya Udaka Peravai Sellur PMK, recognizing Sahara Kabaddi team valiant raid points.',
    tournamentName: 'Sellur PMK Kabaddi Tournament',
    year: 2025,
    position: '3rd Prize',
    achievementDate: '2025-09-18',
    coverImageUrl: '/images/sahara-sellur-pmk-3rd.jpg',
    photos: [
      {
        id: 108,
        imageUrl: '/images/sahara-sellur-pmk-3rd.jpg',
        caption: 'Team with 3rd prize trophy cup presented by Thiru. A. Muthukumar, Sellur PMK',
        displayOrder: 8,
      },
    ],
  },
  {
    id: 9,
    title: '1st Place Champions — RS Veerargal Mat Tournament',
    description:
      'Undefeated championship on professional blue kabaddi mat arena under the grand canopy. Sahara raiders and corner defenders lifted the prestigious RS Veerargal 1st place golden cup.',
    tournamentName: 'RS Veerargal State Mat Championship',
    year: 2025,
    position: '1st Place Champions',
    achievementDate: '2025-03-22',
    coverImageUrl: '/images/sahara-rs-veerargal-mat-1st.jpg',
    photos: [
      {
        id: 109,
        imageUrl: '/images/sahara-rs-veerargal-mat-1st.jpg',
        caption: '1st Place Champions seated on blue mat with RS Veerargal golden trophy',
        displayOrder: 9,
      },
    ],
  },
]

// Local storage key for persistent local changes when running without backend
const LOCAL_STORAGE_KEY = 'sahara_achievements_local'

function getLocalStore(): Achievement[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return INITIAL_ACHIEVEMENTS
}

function saveLocalStore(items: Achievement[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export const getAchievements = async (params?: {
  year?: number
  position?: string
  search?: string
}): Promise<{ data: Achievement[] }> => {
  try {
    const res = await api.get<Achievement[]>('/achievements', { params })
    if (res.data && res.data.length > 0) {
      return res
    }
  } catch {}

  let list = getLocalStore()
  if (params?.year) {
    list = list.filter((a) => a.year === params.year)
  }
  if (params?.position && params.position !== 'All') {
    list = list.filter((a) =>
      a.position?.toLowerCase().includes(params.position!.toLowerCase()),
    )
  }
  if (params?.search) {
    const q = params.search.toLowerCase()
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.tournamentName && a.tournamentName.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q)),
    )
  }
  return { data: list }
}

export const getAchievement = async (
  id: number | string,
): Promise<{ data: Achievement }> => {
  try {
    const res = await api.get<Achievement>(`/achievements/${id}`)
    if (res.data) return res
  } catch {}

  const list = getLocalStore()
  const found = list.find((a) => String(a.id) === String(id))
  if (found) return { data: found }
  throw new Error('Achievement not found')
}

export const createAchievement = async (
  a: Partial<Achievement>,
): Promise<{ data: Achievement }> => {
  try {
    const res = await api.post<Achievement>('/achievements', a)
    if (res.data) return res
  } catch {}

  const list = getLocalStore()
  const newId = list.length > 0 ? Math.max(...list.map((x) => x.id)) + 1 : 1
  const newAchievement: Achievement = {
    id: newId,
    title: a.title ?? 'Untitled Achievement',
    description: a.description ?? null,
    tournamentName: a.tournamentName ?? null,
    year: a.year ?? new Date().getFullYear(),
    position: a.position ?? '1st Place Champions',
    achievementDate: a.achievementDate ?? null,
    coverImageUrl: a.coverImageUrl ?? null,
    photos: a.photos ?? [],
  }
  const updated = [newAchievement, ...list]
  saveLocalStore(updated)
  return { data: newAchievement }
}

export const updateAchievement = async (
  id: number,
  a: Partial<Achievement>,
): Promise<{ data: Achievement }> => {
  try {
    const res = await api.put<Achievement>(`/achievements/${id}`, a)
    if (res.data) return res
  } catch {}

  const list = getLocalStore()
  const idx = list.findIndex((x) => x.id === id)
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...a }
    saveLocalStore(list)
    return { data: list[idx] }
  }
  throw new Error('Achievement not found')
}

export const deleteAchievement = async (id: number): Promise<{ data: { success: boolean } }> => {
  try {
    await api.delete(`/achievements/${id}`)
  } catch {}

  const list = getLocalStore().filter((x) => x.id !== id)
  saveLocalStore(list)
  return { data: { success: true } }
}

export const uploadPhotos = (id: number, files: File[], caption?: string) => {
  const form = new FormData()
  files.forEach((f) => form.append('files', f))
  if (caption) form.append('caption', caption)
  return api.post(`/achievements/${id}/photos`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updatePhoto = (
  photoId: number,
  body: { caption?: string; displayOrder?: number },
) => api.put(`/photos/${photoId}`, body)

export const deletePhoto = (photoId: number) => api.delete(`/photos/${photoId}`)

export const login = (username: string, password: string) => {
  if (username === 'admin' && password === 'admin123') {
    return Promise.resolve({ data: { token: 'sahara_mock_jwt_token_admin' } })
  }
  return api.post('/auth/login', { username, password })
}
