'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { privateAxios } from '@/lib/axiosInstance';

interface Incident {
    incident_id: string;
    reporter: number;
    reporter_name: string;
    details: string;
    reported_date: string;
    priority: string;
    status: string;
}

const Incidents = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error('You must be logged in to view this page.');
            router.push('/auth/login');
            return;
        }

        const fetchIncidents = async () => {
            try {
                const response = await privateAxios.get('/incidents/');
                setIncidents(response.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch incidents.');
            }
        };

        fetchIncidents();
    }, [router]);

    const handleEdit = (incident: Incident) => {
        setEditingIncident(incident);
    };

    const handleUpdate = async (updatedIncident: Incident) => {
        try {
            const response = await privateAxios.patch(`/incidents/${updatedIncident.incident_id}/`, updatedIncident);
            setIncidents((prev) =>
                prev.map((incident) => (incident.incident_id === updatedIncident.incident_id ? response.data : incident))
            );
            setEditingIncident(null);
            toast.success('Incident updated successfully!');
        } catch (error: any) {
            console.error(error);
            if (error?.response?.data?.error) {
                toast.error(error.response.data.error); // Display specific error message
            } else {
                toast.error('Failed to update incident.');
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Your Incidents</h1>
            <div className="space-y-4">
                {incidents.map((incident) => (
                    <div key={incident.incident_id} className="border p-4 rounded">
                        {editingIncident?.incident_id === incident.incident_id ? (
                            <IncidentForm incident={editingIncident} onUpdate={handleUpdate} />
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold">{incident.reporter_name}</h2>
                                <p><strong>Details:</strong> {incident.details}</p>
                                <p><strong>Reported Date:</strong> {new Date(incident.reported_date).toLocaleString()}</p>
                                <p><strong>Priority:</strong> {incident.priority}</p>
                                <p><strong>Status:</strong> {incident.status}</p>
                                <button
                                    onClick={() => handleEdit(incident)}
                                    className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const IncidentForm = ({ incident, onUpdate }: { incident: Incident; onUpdate: (incident: Incident) => void }) => {
    const [formData, setFormData] = useState(incident);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block">Details:</label>
                <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>
            <div>
                <label className="block">Priority:</label>
                <input
                    type="text"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>
            <div>
                <label className="block">Status:</label>
                <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>
            <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                Update Incident
            </button>
        </form>
    );
};

export default Incidents;
