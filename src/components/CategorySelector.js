import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";

export default function CategorySelector(props) {
    const { selectedBudgetType, remoteBudgets, onChange } = props;
    const [selected, setSelected] = useState("");
    useEffect(() => {
        setSelected(selectedBudgetType);
    }, [remoteBudgets, setSelected, selectedBudgetType]);
    const options = remoteBudgets.map((rb, i) => {
        const { title, key } = rb;
        return (
            <option key={i} value={key}>
                {title}
            </option>
        );
    });
    options.unshift(<option value="">NONE</option>);

    return (
        <>
            <Form.Select
                value={selected}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                className="budget-type-selector"
                data-bs-theme="dark"
                size="sm"
                aria-label="Default select example"
            >
                {options}
            </Form.Select>
        </>
    );
}