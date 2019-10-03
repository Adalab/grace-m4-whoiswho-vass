import React from "react";
import "./App.scss";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";
import foto from "./perfil-defecto.png";
import SearchList from "./components/SearchList";

let allEmployees = [];
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      nombre_empleado: "",
      id: "",
      foto_empleado: foto,
      childrens: [],
      parent: [],
      queryInput: ""
    };
    this.getData2 = this.getData2.bind(this);
    this.getParent = this.getParent.bind(this);
    this.getAllData = this.getAllData.bind(this);
    this.compareData = this.compareData.bind(this);
    this.getValue = this.getValue.bind(this);
    this.consolea = this.consolea.bind(this);
    this.getAllData();
  }
  componentDidMount() { }
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
      if (childrens !== []) {
        this.setState({
          childrens: childrens
        });
      }
    }
  }

  getParent(data) {
    fetch(
      `https://adalab-whoiswho.azurewebsites.net/api/employees/${data.id_superior}`
    )
      .then(response => response.json())
      .then(data => {
        const spread = [
          {
            nombre_empleado:
              `${data.nombre_empleado ? data.nombre_empleado : ""}` +
              ` ${data.apellidos_empleado ? data.apellidos_empleado : ""} `,
            id: data.id_empleado,
            foto_empleado: data.foto_empleado !== "" ? data.foto_empleado : foto
          },
          ...this.state.parent
        ];
        this.setState({
          parent: spread
        });
        if (data.id_superior !== "") {
          return this.getParent(data);
        }
      });
  }

  getData2(id) {
    this.setState({
      parent: []
    });
    if (!isNaN(id)) {
      fetch(`https://adalab-whoiswho.azurewebsites.net/api/employees/${id}`)
        .then(response => response.json())
        .then(data => {
          this.setState(
            {
              nombre_empleado:
                `${data.nombre_empleado ? data.nombre_empleado : ""}` +
                ` ${data.apellidos_empleado ? data.apellidos_empleado : ""} `,
              id: data.id_empleado,
              foto_empleado:
                data.foto_empleado !== "" ? data.foto_empleado : foto
            },
            () => {
              this.compareData();
            }
          );
          if (data.id_superior !== "" && id > 0 && id < allEmployees.length) {
            return this.getParent(data);
          } else {
            this.setState({
              parent: []
            });
          }
        });
    }
  }

  getValue(ev) {
    const inputValue = ev.target.value;
    this.setState({
      queryInput: inputValue
    });
    const value = parseInt(ev.target.value);
    if (isNaN(value)) {
      this.setState({
        nombre_empleado: "",
        id: "",
        foto_empleado: foto,
        childrens: [],
        parent: []
      });
    } else {
      this.getData2(value);
    }
  }

  consolea(ev) {
    let idSelected = ev.currentTarget.dataset.id;
    this.getData2(idSelected);
  }

  render() {
    const getClass = id => {
      if (id === this.state.id) {
        return "color";
      }
    };
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
      if (this.state.nombre_empleado !== "") {
        return (
          <div className={`employee__children ${getClass(node.id)}`}>
            <div
              className="employee__img--container"
              onClick={this.consolea}
              data-id={node.id_empleado}
            >
              <img
                src={node.foto_empleado !== "" ? node.foto_empleado : foto}
                className="employee__img"
                alt={node.nombre_empleado}
              ></img>
            </div>
            <p className="employee__name">
              {node.nombre_empleado} {node.apellidos_empleado}
            </p>
          </div>
        );
      }

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

    const childrens = this.state.childrens.map(children => {
      return (
        <React.Fragment>
          <div className="employee__children--branchppal"></div>
          <div className="children-div">
            <div className="employee__children--branch"></div>
            <div className="employee__children--center">
              <OrgChart
                tree={children}
                NodeComponent={MyNodeComponentChildren}
              />
            </div>
          </div>
        </React.Fragment>
      );
    });

    return (
      <div className="employees__container">
        <SearchList
          consolea={this.consolea}
          queryInput={this.state.queryInput}
          getValue={this.getValue}
          allEmployees={allEmployees}
        />

        <section className="section">
          <div className="employee__parents--container" id="initechOrgChart">
            {parents}
          </div>

          <div className="employee__childrens--container" id="initechOrgChart">
            <OrgChart
              tree={this.state}
              NodeComponent={MyNodeComponentChildren}
            />
          </div>

          <div className="employee__childrens--container" id="initechOrgChart">
            {childrens}
          </div>
        </section>
      </div>
    );
  }
}

export default App;
