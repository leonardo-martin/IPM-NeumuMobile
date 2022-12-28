import { SpecialtiesDTO } from '@models/Specialties'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sortByStringField } from '@utils/common'


interface CommonContextType {
  specialties: SpecialtiesDTO[]
}

const initialState: CommonContextType = {
  specialties: []
}

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setSpecialties: (state = initialState, action: PayloadAction<SpecialtiesDTO[]>) => {
      state.specialties = action.payload.sort((a, b) => sortByStringField(a, b, 'description')) || action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSpecialties } = commonSlice.actions

export default commonSlice.reducer