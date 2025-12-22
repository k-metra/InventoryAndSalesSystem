import { useQueries, useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../axios/api';
import LoadingScreen from '../pages/loadingScreen';
import { type Field, type OptionField } from '../types/fields';

import InputField from './inputField';

import { useEffect, useState, type ChangeEvent } from 'react';
import getNestedValue from '../utils/getNestedValue';
import setNestedValue from '../utils/setNestedValue';

import { ImSpinner7 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { FaPencil } from "react-icons/fa6";
import { useToast } from '../contexts/ToastContext';

type EditElementModalProps = {
    application: string;
    fields: Field[];
    editId: string;
    onClose: () => void;
}


export default function EditElementModal({application, fields, editId, onClose }: EditElementModalProps) {
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const { data, isPending, isError } = useQuery({
        queryKey: [`${application}`, editId],
        queryFn: async ({ queryKey }) => {
            const [key, editId] = queryKey;

            const resp = await api.get(`/${key}/${editId}`)
            .then(res => res.data)
            .catch((err) => {
                console.log(`Error fetching ${key} details`, err);
                return null;
            });

            return resp;
        } 
    });

    const optionsQueries = useQueries({
        queries: fields
        .filter((field): field is OptionField  => 
            field.type === 'options' && !!field.fetchOptions )
        .map((field) => ({
            queryKey: [`${application}`, field.key, 'options'],
            queryFn: field.fetchOptions!
        }))
    });

    const optionsMap = fields
        .filter((field): field is OptionField => 
            field.type === 'options' && !!field.fetchOptions)
        .reduce((accumulator, field, index) => {
            accumulator[field.key] = optionsQueries[index].data || [];
            return accumulator;
        }, {} as Record<string, any[]>);


    const [formState, setFormState] = useState<Record<string, any>>({});
    console.log(formState);


    useEffect(() => {
        if (data) setFormState(data);
    }, [data]);

    const mutation = useMutation({
        mutationFn: (updatedData: Record<string, any>) => {
            return api.put(`/${application}/${editId}`, updatedData).then(res => res.data);
        },

        onSuccess: () => {
            onClose();
            addToast(`Successfully updated Product ID ${editId}.`, 'success');
            queryClient.invalidateQueries({ queryKey: [application] });
        },

        onError: (error: any) => {
            console.error('Error updating element:', error);
            addToast(`Failed to update ${application} ID ${editId}.`, 'error');
        }
    })

    const handleChange = (key: string, value: any) => {
        setFormState(prev => {
            const copy = { ... prev };
            setNestedValue(copy, key, value);

            return copy;
        })
        ;
    };

    const handleSave = async () => {
        mutation.mutate(formState);
    }


    return (
        <div className="fixed h-screen w-screen bg-black/60 top-0 left-0 flex items-center justify-center z-10000">
            {isPending ? 
            <LoadingScreen />
            : isError ? (
                <div className="p-4 w-full h-full text-red-500 flex items-center justify-center">
                    <p>Ran into an error loading the {application} details.</p>
                </div>
            ) : (
                (
                    <div className="custom-scrollbar relative bg-white rounded-lg w-full max-w-[70vh] max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <h5 className="font-bold text-text mb-4">Edit Element</h5>

                            <div className="grid grid-cols-1 gap-4">
                                 {fields.map((field) => {
                            if (field.type === 'readonly') {
                                return (
                                    <div key={field.key} className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                        <p className="text-gray-900">{formState[field.key]}</p>
                                    </div>
                                );
                            } else if (field.type === 'text') {
                                return (
                                    <div key={field.key} className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                        <InputField
                                            type="text"
                                            value={formState[field.key] || ''}
                                            onChange={(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleChange(field.key, e.target.value)}
                                        />
                                       
                                    </div>
                                )
                            } else if (field.type === 'options') {
                                const options = optionsMap[field.key] || [];

                                return (
                                    <div key={field.key} className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>

                                        <InputField
                                            type="options"
                                            data={options} 
                                            value={getNestedValue(formState, field.key) || ''} 
                                            onChange={(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleChange(field.key, e.target.value)}
                                        />

                                    </div>
                                )
                            } else if (field.type === 'number') {
                                return (
                                    <div key={field.key} className="mb-4">  
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>   
                                        <InputField
                                            type="number"
                                            value={formState[field.key] || ''}
                                            onChange={(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleChange(field.key, e.target.value)}
                                        />
                                    </div>
                                )
                            } else if (field.type === 'textarea') {
                                return (
                                    <div key={field.key} className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                        <textarea
                                            value={formState[field.key] || ''}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            className="w-full border border-black/25 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            rows={4}
                                        />
                                    </div>
                                )
                            } else if (field.type === 'boolean') {
                                return (
                                    <div key={field.key} className="mb-4 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={!!formState[field.key]}
                                            onChange={(e) => handleChange(field.key, e.target.checked)}
                                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                                    </div>
                                )
                            }
                        })}
                            </div>
                        </div>

                        <div className="flex border-t border-black/25 justify-end items-center gap-2 bottom-0 left-0 sticky p-2 bg-white *:cursor-pointer">
                            <button onClick={handleSave} disabled={mutation.isPending} className={`inline-flex items-center gap-2 bg-primary text-white px-4 py-2 disabled:opacity-50 rounded`}>
                                {mutation.isPending && <ImSpinner7 size={20} className="inline-block text-white animate-spin" />}
                                Save Edits
                                <FaPencil className="inline-block text-white" size={15} />
                            </button>
                            <button onClick={onClose} disabled={mutation.isPending} className="inline-flex items-center gap-2 bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded">
                                Cancel
                                <IoMdClose className="inline-block text-white" size={24} />
                            </button>
                        </div>
                    </div>
                )  
            )
        }
        </div>
    )
}