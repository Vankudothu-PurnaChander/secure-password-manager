
import {useState} from 'react';

function useLocalForm(initialValues) {  
  const [formData,setFormData]=useState(initialValues);
  const handleChange = (e) => {
    setFormData((prev)=>({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return { formData, handleChange, setFormData };
}

export default useLocalForm;
