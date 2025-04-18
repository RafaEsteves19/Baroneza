import React, { useState, useEffect } from "react";
import axios from "axios";

function New() {
  const [components, setComponents] = useState([]);
  const [fixedData, setFixedData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/newcomponents").then((res) => {
      setFixedData(res.data);
    });
  }, []);

  const addComponent = () => {
    setComponents([...components, { title: "", text: "", link: "", image: null }]);
  };

  const handleChange = (index, field, value) => {
    const newComponents = [...components];
    newComponents[index][field] = value;
    setComponents(newComponents);
  };

  const handleFileChange = (index, file) => {
    const newComponents = [...components];
    newComponents[index].image = file;
    setComponents(newComponents);
  };

  const saveData = async () => {
    const component = components[0];
    const formData = new FormData();

    formData.append("title", component.title);
    formData.append("text", component.text);
    formData.append("link", component.link);
    if (component.image) {
      formData.append("image", component.image);
    }

    try {
      await axios.post("http://localhost:5000/newcomponents/save", formData);
      setComponents([]);
      axios.get("http://localhost:5000/newcomponents").then((res) => setFixedData(res.data));
    } catch (error) {
      console.error("Erro ao salvar componente", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={components.length === 0 ? addComponent : saveData}>
        {components.length === 0 ? "+" : "Salvar"}
      </button>

      {components.map((component, index) => (
        <div key={index} style={{ marginTop: "10px", padding: "10px", border: "1px solid black" }}>
          <input
            type="text"
            placeholder="Título"
            value={component.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
          />
          <input
            type="text"
            placeholder="Texto"
            value={component.text}
            onChange={(e) => handleChange(index, "text", e.target.value)}
          />
          <input
            type="text"
            placeholder="Link"
            value={component.link}
            onChange={(e) => handleChange(index, "link", e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(index, e.target.files[0])}
          />
        </div>
      ))}

      <hr />
      <h2>Dados Fixos</h2>
      {fixedData.map((item, index) => (
        <div key={index} style={{ marginBottom: "20px", padding: "10px", border: "1px solid gray" }}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>
          {item.image && (
            <img
              src={`http://localhost:5000${item.image}`}
              alt="Uploaded"
              style={{ maxWidth: "100px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default New;
