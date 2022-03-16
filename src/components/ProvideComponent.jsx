import { MdAdd } from "react-icons/md";
import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function ProvideComponent(props) {
    const [amountOfBLOOM, setAmountOfBLOOM] = useState(0);
    const [amountOfTECH, setAmountOfTECH] = useState(0);
    const [error, setError] = useState("");

    const getProvideEstimate = async (token, value) => {
        if (["", "."].includes(value)) return;
        if (props.contract !== null) {
            try {
                let estimate;
                if (token === "BLOOM") {
                    estimate = await props.contract.getEquivalentToken2Estimate(
                        value * PRECISION
                    );
                    setAmountOfTECH(estimate / PRECISION);
                } else {
                    estimate = await props.contract.getEquivalentToken1Estimate(
                        value * PRECISION
                    );
                    setAmountOfBLOOM(estimate / PRECISION);
                }
            } catch (err) {
                if (err?.data?.message?.includes("Zero Liquidity")) {
                    setError("Message: Empty pool. Set the initial conversion rate.");
                } else {
                    alert(err?.data?.message);
                }
            }
        }
    };

    const onChangeAmountOfBLOOM = (e) => {
        setAmountOfBLOOM(e.target.value);
        getProvideEstimate("BLOOM", e.target.value);
    };

    const onChangeAmountOfTECH = (e) => {
        setAmountOfTECH(e.target.value);
        getProvideEstimate("TECH", e.target.value);
    };

    // Adds liquidity to the pool
    const provide = async () => {
        if (["", "."].includes(amountOfBLOOM) || ["", "."].includes(amountOfTECH)) {
            alert("Amount should be a valid number");
            return;
        }
        if (props.contract === null) {
            alert("Connect to Metamask");
            return;
        } else {
            try {
                let response = await props.contract.provide(
                    amountOfBLOOM * PRECISION,
                    amountOfTECH * PRECISION
                );
                await response.wait();
                setAmountOfBLOOM(0);
                setAmountOfTECH(0);
                await props.getHoldings();
                alert("Success");
                setError("");
            } catch (err) {
                err && alert(err?.data?.message);
            }
        }
    };

    return (
        <div className="tabBody">
            <BoxTemplate
                leftHeader={"Amount of BLOOM"}
                value={amountOfBLOOM}
                onChange={(e) => onChangeAmountOfBLOOM(e)}
            />
            <div className="swapIcon">
                <MdAdd />
            </div>
            <BoxTemplate
                leftHeader={"Amount of TECH"}
                value={amountOfTECH}
                onChange={(e) => onChangeAmountOfTECH(e)}
            />
            <div className="error">{error}</div>
            <div className="bottomDiv">
                <div className="btn" onClick={() => provide()}>
                    Provide
                </div>
            </div>
        </div>
    );
}
