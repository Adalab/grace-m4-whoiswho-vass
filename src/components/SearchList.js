import React from "react"



const SearchList = (props) => {
    console.log(props)
    return (
        <div>
            <input type="text" onChange={props.getValue}></input>
            <ul> {props.allEmployees.filter(employee => employee.nombre_empleado.includes(props.queryInput))
                .map(employee => {
                    return (
                        <li data-id={employee.id_empleado} onClick={props.consolea}>{`${employee.nombre_empleado}` + ` ${employee.apellidos_empleado ? employee.apellidos_empleado : ""} `} </li>
                    )
                })}
            </ul>
        </div>

    )

}



export default SearchList