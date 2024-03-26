"use client";
import { React, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";

export default function DynamicForm({ data }) {
    const router = useRouter();
    const formData = data[0];
    const gameId = data[1];

    const [formValues, setFormValues] = useState({
        input: {},
        select: {},
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormValues((prevValues) => ({
            ...prevValues,
            input: {
                ...prevValues.input,
                [name]: value,
            },
        }));
    };

    const handleSelectChange = (e) => {
        const { name, options } = e.target;
        const value = Array.from(options)
            .filter((option) => option.selected)
            .map((option) => option.value);

        setFormValues((prevValues) => ({
            ...prevValues,
            select: {
                ...prevValues.select,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const metrics = formValues;
        const heroId = secureLocalStorage.getItem("id");

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/metric`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                heroId: heroId,
                gameId: gameId,
                metrics: metrics,
            }),
        });

        const data = await res.json();

        if (data.message === "Success") {
            console.log("Success!");
        } else {
            console.log("Something went wrong!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {formData.input &&
                formData.input.map((inputName, index) => (
                    <div key={index}>
                        <label>{inputName}</label>
                        <input
                            type="text"
                            name={inputName}
                            placeholder={inputName}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}
            {formData.select &&
                Object.entries(formData.select).map(
                    ([selectName, options], index) => (
                        <div key={index}>
                            <label>{selectName}</label>
                            <select
                                name={selectName}
                                onChange={handleSelectChange}
                                multiple={true}
                            >
                                {options.map((option, optionIndex) => (
                                    <option key={optionIndex} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )
                )}
            <button type="submit">Submit</button>
        </form>
    );
}
