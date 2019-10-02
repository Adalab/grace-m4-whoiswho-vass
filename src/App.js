import React from "react";
import "./App.css";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";
import foto from "./perfil-defecto.png";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      nombre_empleado: "",
      id: "",
      foto_empleado: foto,
      children: [],
      parent: []
    };
    this.getData = this.getData.bind(this);
    this.getValue = this.getValue.bind(this);
    this.consolea = this.consolea.bind(this);
  }

  getData(id) {
    fetch(`https://adalab-whoiswho.azurewebsites.net/api/employees/${id}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          nombre_empleado: data.nombre_empleado + data.apellidos_empleado,
          id: data.id_empleado
        });
        return fetch(`https://adalab-whoiswho.azurewebsites.net/api/employees/${data.id_superior}`)
          .then(response => response.json())
          .then(data => {
            this.setState({
              parent: [
                {
                  nombre_empleado: data.nombre_empleado + data.apellidos_empleado,
                  id: data.id_empleado,
                  foto_empleado: foto
                }
              ],
              children: [
                {
                  id_superior: data.id_superior
                }
              ]
            });
            if (data.id_superior !== "") {
              return fetch(`https://adalab-whoiswho.azurewebsites.net/api/employees/${data.id_superior}`)
                .then(response => response.json())
                .then(data => {
                  const spread = [
                    {
                      nombre_empleado: data.nombre_empleado + data.apellidos_empleado,
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
      });
  }

  getValue(ev) {
    const value = parseInt(ev.target.value);
    this.getData(value);
  }

  consolea(ev) {
    console.log(ev.currentTarget.dataset.id);
  }

  render() {
    const MyNodeComponent = ({ node }) => {
      return (
        <div className="perfil">
          <div className="initechNode">
            <img src={node.foto_empleado} className="img" alt={node.nombre_empleado}></img>
          </div>
          <p className="name">{node.nombre_empleado}</p>
        </div>
      );
    };

    const MyNodeComponentChildren = ({ node }) => {
      return (
        <div className="children">
          <div className="initechNode" onClick={this.consolea} data-id={node.id}>
            <img src={node.foto_empleado} className="img" alt={node.nombre_empleado}></img>
          </div>
          <p className="name">{node.nombre_empleado}</p>
        </div>
      );
    };

    // const parentsState = this.state.parent;
    const parents = this.state.parent.map(parent => {
      return (
        <React.Fragment>
          <div className="center-parents">
            <OrgChart tree={parent} NodeComponent={MyNodeComponent} />
          </div>
          <div className="rayita"></div>
        </React.Fragment>
      );
    });

    return (
      <div className="employees-container">
        <input type="text" onChange={this.getValue}></input>

        <div className="App flex" id="initechOrgChart">
          {parents}
        </div>

        <div className="App" id="initechOrgChart">
          <OrgChart tree={this.state} NodeComponent={MyNodeComponentChildren} />
        </div>
      </div>
    );
  }
}

export default App;
