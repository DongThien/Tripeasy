import React from 'react';
import { Check, X } from 'lucide-react';

const TourDetailServices = ({ included, excluded }) => (
    <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Dịch vụ bao gồm</h2>
            <ul className="mt-4 space-y-3">
                {included.map((service) => (
                    <li key={service} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="mt-0.5 h-4 w-4 text-green-600" />
                        <span>{service}</span>
                    </li>
                ))}
            </ul>
        </article>

        <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Không bao gồm</h2>
            <ul className="mt-4 space-y-3">
                {excluded.map((service) => (
                    <li key={service} className="flex items-start gap-2 text-sm text-gray-700">
                        <X className="mt-0.5 h-4 w-4 text-red-600" />
                        <span>{service}</span>
                    </li>
                ))}
            </ul>
        </article>
    </section>
);

export default TourDetailServices;