"use client";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function DynamicList({ data }) {
    const [heroMetric, setHeroMetric] = useState([]);
    useEffect(() => {
        const heroId = secureLocalStorage.getItem("id");
        const gameId = data.param;

        const fetchHeroMetric = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/metric/${heroId}/${gameId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await res.json();
            setHeroMetric(data.gameMetric[0].metrics);
        };

        fetchHeroMetric();
    }, []);

    const renderListItems = (obj) => {
        return Object.entries(obj).map(([key, value]) => {
            // Check if the value is an array and convert it to a string for display
            const displayValue = Array.isArray(value)
                ? value.join(", ")
                : value;
            return (
                <li key={key}>
                    {key}: {displayValue}
                </li>
            );
        });
    };

    return (
        <div>
            <h2>Current Metrics</h2>
            <ul>{heroMetric.input && renderListItems(heroMetric.input)}</ul>
            <ul>{heroMetric.select && renderListItems(heroMetric.select)}</ul>
        </div>
    );
}
