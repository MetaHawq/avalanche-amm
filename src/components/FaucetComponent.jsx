import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function FaucetComponent(props) {
    const [amountOfBLOOM, setAmountOfBLOOM] = useState(0);
    const [amountOfTECH, setAmountOfTECH] = useState(0);

    const onChangeAmountOfTECH = (e) => {
        setAmountOfTECH(e.target.value);
    };

    const onChangeAmountOfBLOOM = (e) => {
        setAmountOfBLOOM(e.target.value);
    };
	
    // Funds the account with given amount of Tokens 
    async function onClickFund() {
        if (props.contract === null) {
            alert("Connect to Metamask");
            return;
        }
        if (["", "."].includes(amountOfBLOOM) || ["", "."].includes(amountOfTECH)) {
            alert("Amount should be a valid number");
            return;
        }
        try {
            let response = await props.contract.faucet(
                amountOfBLOOM * PRECISION,
                amountOfTECH * PRECISION
            );
            let res = await response.wait();
            console.log("res", res);
            setAmountOfBLOOM(0);
            setAmountOfTECH(0);
            await props.getHoldings();
            alert("Success");
        } catch (err) {
            err?.data?.message && alert(err?.data?.message);
            console.log(err);
        }
    }

    return (
        <div className="tabBody">
            <BoxTemplate
                leftHeader={"Amount of BLOOM"}
                right={"BLOOM"}
                value={amountOfBLOOM}
                onChange={(e) => onChangeAmountOfBLOOM(e)}
            />
            <BoxTemplate
                leftHeader={"Amount of TECH"}
                right={"TECH"}
                value={amountOfTECH}
                onChange={(e) => onChangeAmountOfTECH(e)}
            />
            <div className="bottomDiv">
                <div className="btn" onClick={() => onClickFund()}>
                    Fund
                </div>
            </div>
        </div>
    );
}
