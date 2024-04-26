import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

async function getDati() {
    if (window.location.pathname === "/rimborsi") {
        const response = await fetch("/api/partita/visualizza", {
            credentials: "include"
        });
        return await response.json();
    }
}

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
    scales: {
        x: {
            ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
            }
        },
        y: {
            beginAtZero: false
        }
    }
};



export default function GraficoRimborsi() {
    const [rows, setRows] = useState([]);
    const [media, setMedia] = useState([]);
    const [mediaTotale, setMediaTotale] = useState(0);

    React.useEffect(() => {
        getDati().then((data) => {
            const filteredData = data.filter((row) => row.rimborso !== null);
            setRows(filteredData);
            for (let i = 0; i < filteredData.length; i++) {
                setMediaTotale((mediaTotale) => mediaTotale + filteredData[i].rimborso);
            }
            setMediaTotale((mediaTotale) => mediaTotale / filteredData.length);
            for (let i = 0; i < filteredData.length; i++) {
                let mediaCalcolata = 0;
                for (let j = 0; j < i + 1; j++) {
                    mediaCalcolata += filteredData[j].rimborso;
                }
                mediaCalcolata = mediaCalcolata / (i + 1);
                setMedia((media) => [...media, mediaCalcolata]);
            }
        });
    }, []);



    const data = {
        labels: rows.map((row) => row.gara),
        datasets: [
            {
                label: '# RIMBORSI',
                data: rows.map((row) => row.rimborso),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: '# MEDIA RIMBORSI',
                data: media,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: '# MEDIA TOTALE',
                data: Array(Object.keys(rows).length).fill(mediaTotale),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }
        ],
    };

    return <Line options={options} data={data} />;
}
