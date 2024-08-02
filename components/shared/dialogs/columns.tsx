import { PlusIcon } from '@radix-ui/react-icons'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../../components/ui/alert-dialog'
import { Button } from '../../../components/ui/button'
import { ColumnDef, Table } from '@tanstack/react-table'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../../ui/select'
import { useState } from 'react'
import { Input } from '../../ui/input'

export function AddColumnDialog<TData>({
    cols,
    setCols
}: {
    cols: ColumnDef<TData, any>[]
    setCols: React.Dispatch<React.SetStateAction<ColumnDef<TData, any>[]>>
}) {
    const [type, setType] = useState<string>('')
    const [columnType, setColumnType] = useState<string>('text')
    const [defaultValue, setDefaultValue] = useState<string>('')

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline' >
                    <PlusIcon className='h-5 w-5 mr-2' />
                    Add Column
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add Column</AlertDialogTitle>
                    <AlertDialogDescription>
                        Add a new column to the table
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {/* 
                    - first select column type: one value, multiple values
                    - if one value, then select type: text, number, date, boolean. and default value
                    - if multiple values, then select type: text, number, date, boolean. and default value
                */}
                <Select
                    onValueChange={(value) => setType(value)}
                    value={type}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Types</SelectLabel>
                            <SelectItem value="single">Single Value</SelectItem>
                            <SelectItem value="multiple">Multiple Values</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {type !== '' && (
                    <Select
                        onValueChange={(value) => setColumnType(value)}
                        value={columnType}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Column Type</SelectLabel>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
                {type !== '' && <Input type="text" placeholder={
                    columnType === 'text' ? 'Enter default text' :
                        columnType === 'number' ? 'Enter default number' :
                            columnType === 'date' ? 'Enter default date' :
                                columnType === 'boolean' ? 'Enter default boolean' : ''
                } value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} />}

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        console.log(cols)
                        setCols([...cols, {
                            accessorKey: 'new',
                            header: 'New Column',
                            cell: ({ row }) => 'New Column',
                            enableSorting: true,
                            enableHiding: true,
                        }])
                    }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}