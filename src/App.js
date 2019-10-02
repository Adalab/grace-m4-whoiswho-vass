import React from "react";
import "./App.scss";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";
import foto from "./perfil-defecto.png";
import SearchList from "./components/SearchList"

let allEmployees = [];
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      nombre_empleado: "",
      id: "",
      foto_empleado: foto,
      children: [],
      parent: [],
      queryInput: ""
    };
    this.getData = this.getData.bind(this);
    this.getAllData = this.getAllData.bind(this);
    this.compareData = this.compareData.bind(this);
    this.getValue = this.getValue.bind(this);
    this.consolea = this.consolea.bind(this);
    this.changeColorSelected = this.changeColorSelected.bind(this);
    this.getAllData();
  }

  getAllData() {
    fetch("https://adalab-whoiswho.azurewebsites.net/api/employees/")
      .then(response => response.json())
      .then(data => {
        allEmployees = data;
      });
  }

  compareData() {
    if (this.state.id !== "") {
      let childrens = allEmployees.filter(
        employee => employee.id_superior === this.state.id
      );
      console.log(childrens);
      if (childrens !== []) {
        this.setState({
          children: childrens
        });
      }
    }
  }

  getData(id) {
    if (!isNaN(id)) {
      fetch(`https://adalab-whoiswho.azurewebsites.net/api/employees/${id}`)
        .then(response => response.json())
        .then(data => {
          this.setState(
            {
              nombre_empleado:
                `${data.nombre_empleado ? data.nombre_empleado : ""}` +
                ` ${data.apellidos_empleado ? data.apellidos_empleado : ""} `,
              id: data.id_empleado
            },
            () => {
              this.compareData();
            }
          );

          if (data.id_superior !== "") {
            return fetch(
              `https://adalab-whoiswho.azurewebsites.net/api/employees/${data.id_superior}`
            )
              .then(response => response.json())
              .then(data => {
                this.setState({
                  parent: [
                    {
                      nombre_empleado:
                        `${data.nombre_empleado ? data.nombre_empleado : ""}` +
                        ` ${
                        data.apellidos_empleado ? data.apellidos_empleado : ""
                        } `,
                      id: data.id_empleado,
                      foto_empleado: foto
                    }
                  ]
                });
                if (data.id_superior !== "") {
                  return fetch(
                    `https://adalab-whoiswho.azurewebsites.net/api/employees/${data.id_superior}`
                  )
                    .then(response => response.json())
                    .then(data => {
                      const spread = [
                        {
                          nombre_empleado:
                            `${
                            data.nombre_empleado ? data.nombre_empleado : ""
                            }` +
                            ` ${
                            data.apellidos_empleado
                              ? data.apellidos_empleado
                              : ""
                            } `,
                          id: data.id_empleado,
                          foto_empleado: foto
                        },
                        ...this.state.parent
                      ];
                      this.setState({
                        parent: spread
                      });
                    });
                }
              });
          } else {
            this.setState({
              parent: []
            });
          }
        });
    }
  }

  getValue(ev) {
    const inputValue = ev.target.value
    this.setState({
      queryInput: inputValue
    })
    const value = parseInt(ev.target.value);
    if (isNaN(value)) {
      this.setState({
        nombre_empleado: "",
        id: "",
        foto_empleado: foto,
        children: [],
        parent: []
      });
    } else {
      this.getData(value);
    }

  }

  changeColorSelected(ev) {
    const selected = ev.currentTarget;
    selected.classList.toggle("employee__shadow");
  }
  consolea(ev) {
    console.log(ev.currentTarget)
    let idSelected = ev.currentTarget.dataset.id;
    this.getData(idSelected);
  }

  render() {
    const MyNodeComponent = ({ node }) => {
      return (
        <div className="employee">
          <div
            className="employee__img--container"
            onClick={this.consolea}
            data-id={node.id}
          >
            <img
              src={node.foto_empleado}
              className="employee__img"
              alt={node.nombre_empleado}
            ></img>
          </div>
          <p className="employee__name">{node.nombre_empleado}</p>
        </div>
      );
    };

    const MyNodeComponentChildren = ({ node }) => {
      return (
        <div className="employee__children">
          <div
            className="employee__img--container"
            onClick={this.consolea}
            data-id={node.id_empleado}
          >
            <img
              src={node.foto_empleado}
              className="employee__img"
              alt={node.nombre_empleado}
            ></img>
          </div>
          <p className="employee__name">{node.nombre_empleado}</p>
        </div>
      );
    };

    const parents = this.state.parent.map(parent => {
      return (
        <React.Fragment>
          <div className="employee__parent--center">
            <OrgChart tree={parent} NodeComponent={MyNodeComponent} />
          </div>
          <div className="employee__parent--branch"></div>
        </React.Fragment>
      );
    });

    return (
      <div className="employees__container">

        <SearchList consolea={this.consolea} queryInput={this.state.queryInput} getValue={this.getValue} allEmployees={allEmployees} />

        <div className="employee__parents--container" id="initechOrgChart">
          {parents}
        </div>

        <div className="employee__childrens--container" id="initechOrgChart">
          <OrgChart tree={this.state} NodeComponent={MyNodeComponentChildren} />
        </div>
      </div>
    );
  }
}

export default App;
