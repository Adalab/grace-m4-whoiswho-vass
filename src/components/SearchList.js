import React from "react";
import "../stylesheets/SearchList.scss";

function printList(props) {
  if (props.queryInput !== "") {
    return props.allEmployees
      .filter(employee => employee.nombre_empleado.toUpperCase().includes(props.queryInput.toUpperCase()))

      .map(employee => {
        return (
          <li className="employee__list--item" data-id={employee.id_empleado} onClick={props.consolea}>
            {`${employee.nombre_empleado}` + ` ${employee.apellidos_empleado ? employee.apellidos_empleado : ""} `}{" "}
          </li>
        );
      });
  }
}

function addClass(props) {
  if (props.queryInput === "" || !isNaN(props.queryInput)) {
    return "hidden"
  } else {
    return "employee__list"
  }
}

const SearchList = props => {
  return (
    <div className="employee__searcher">
      <input placeholder="Id o Nombre del Colaborador" className="employee__input" type="text" onChange={props.getValue} value={props.queryInput}></input>
      <ul className={addClass(props)}> {printList(props)} </ul>
    </div>
  );
};

export default SearchList;
