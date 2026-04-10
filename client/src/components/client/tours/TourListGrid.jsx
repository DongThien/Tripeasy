import React from 'react';
import TourListCard from './TourListCard';

const TourListGrid = ({ tours }) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
            <TourListCard key={tour.tour_id} tour={tour} />
        ))}
    </div>
);

export default TourListGrid;