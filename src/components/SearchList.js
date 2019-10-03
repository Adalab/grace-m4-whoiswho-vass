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
  } else {
  }
}

const SearchList = props => {
  const classList = props.queryInput !== "" ? "employee__list" : "hidden";
  return (
    <div className="employee__searcher">
      <input placeholder="Nombre del colaborador" className="employee__input" type="text" onChange={props.getValue} value={props.queryInput}></input>
      <ul className={`${classList}`}> {printList(props)} </ul>
    </div>
  );
};

export default SearchList;
