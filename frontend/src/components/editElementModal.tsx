import { useQueries, useQuery } from '@tanstack/react-query';
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

type EditElementModalProps = {
    application: string;
    fields: Field[];
    editId: string;
    onClose: () => void;
    onSave: () => void;
}


export default function EditElementModal({application, fields, editId, onClose, onSave }: EditElementModalProps) {

    const [saving, setSaving] = useState(false);

    const { data, isPending, isError } = useQuery({
        queryKey: ['elementDetails', application, editId],
        queryFn: async ({ queryKey }) => {
            const [_key, application, editId] = queryKey;

            const resp = await api.get(`/${application}/${editId}`)
            .then(res => res.data)
            .catch((err) => {
                console.log(`Error fetching ${application} details`, err);
                return null;
            });

            return resp;
        }
    });

    const optionsQueries = useQueries({
        queries: fields
        .filter((field): field is OptionField => field.type === 'options' && !!field.fetchOptions)
        .map((field) => ({
            queryKey: [`${application}-${field.key}-options`],
            queryFn: field.fetchOptions!
        }))
    });

    const optionsMap = fields
        .filter((field): field is OptionField => field.type === 'options' && !!field.fetchOptions)
        .reduce((accumulator, field, index) => {
            accumulator[field.key] = optionsQueries[index].data || [];
            return accumulator;
        }, {} as Record<string, any[]>);

    console.log(data);

    const [formState, setFormState] = useState<Record<string, any>>({});

    useEffect(() => {
        if (data) setFormState(data);
    }, [data]);

    const handleChange = (key: string, value: any) => {
        setFormState(prev => {
            const copy = { ... prev };
            setNestedValue(copy, key, value);

            return copy;
        })
        ;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const resp = await api.put(`/${application}/${editId}`, formState);
            console.log("Save response:", resp.data);
            onSave();
        } catch (err) {
            console.log(`Error saving ${application} details`, err);
        } finally {
            setSaving(false);
            onClose();
        }
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
                    <div className="custom-scrollbar relative bg-white rounded-lg max-w-[70vh] max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <h5 className="font-bold text-text mb-4">Edit Element</h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                            }
                        })}
                            </div>
                        </div>

                        <div className="flex border-t border-black/25 justify-end items-center gap-2 bottom-0 left-0 sticky p-2 bg-white *:cursor-pointer">
                            <button onClick={handleSave} disabled={saving} className={`inline-flex items-center gap-2 bg-primary text-white px-4 py-2 disabled:opacity-50 rounded`}>
                                {saving && <ImSpinner7 size={20} className="inline-block text-white animate-spin" />}
                                Save Edits
                                <FaPencil className="inline-block text-white" size={15} />
                            </button>
                            <button onClick={onClose} disabled={saving} className="inline-flex items-center gap-2 bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded">
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