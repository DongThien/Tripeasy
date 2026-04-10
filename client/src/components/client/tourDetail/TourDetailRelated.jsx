import React from 'react';
import TourListGrid from '../tours/TourListGrid';

const TourDetailRelated = ({ tours }) => (
    <section className="mt-12 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
        <h2 className="text-3xl font-bold text-gray-900">Có thể bạn thích</h2>
        <p className="mt-2 text-gray-600">Khám phá các điểm đến hấp dẫn khác</p>

        <div className="mt-5">
            <TourListGrid tours={tours} />
        </div>
    </section>
);

export default TourDetailRelated;