'use client'
import CsvReader from '../../components/csv/csv-reader'
import { UsersContextProvider } from '../../context/csv'

export default function UploadPage() {
  return (
    <UsersContextProvider>
      <div className='container mx-auto py-10'>
        <h1 className='text-3xl font-bold mb-10'>Upload CSV File</h1>
        <CsvReader />
      </div>
    </UsersContextProvider>
  )
}
