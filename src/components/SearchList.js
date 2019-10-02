import React from "react"

function printList(props) {
    console.log("hola")
    if (props.queryInput !== "") {
        return props.allEmployees.filter(employee => employee.nombre_empleado.toUpperCase().includes(props.queryInput.toUpperCase()))

            .map(employee => {
                return (
                    <li data-id={employee.id_empleado} onClick={props.consolea}>{`${employee.nombre_empleado}` + ` ${employee.apellidos_empleado ? employee.apellidos_empleado : ""} `} </li>
                );
            })
    }
};

const SearchList = (props) => {
    console.log(props)
    return (
        <div>
            <input type="text" onChange={props.getValue} value={props.queryInput}></input>
            <ul> {printList(props)} </ul>
        </div>

    )

}



export default SearchList