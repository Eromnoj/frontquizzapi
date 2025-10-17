import { useEffect, useState } from 'react';
import RequestService from '../services/requestService';
import UpdateCatModalComponent from './UpdateCatModalComponent';
import ActionComponent from './ActionComponent';
import ButtonComponent from "./ButtonComponent";
import InputsComponent from "./InputsComponent";
import style from '../styles/components/PendingComponent.module.scss'
type CatData = {
  id: string;
  name: string;
  slug: string;
};

function CategoryComponent() {
  const requestService = RequestService.getInstance()
 
  const [category, setCategory] = useState<{ id: string, name: string, slug: string }[] | []>([])
  const getCat = async () => {
    const resCat = await requestService.get(import.meta.env.VITE_API_URL + "/quiz/categories")
    setCategory(resCat.response)
  }
  useEffect(function () {
    getCat()
  }, [])
  const deleteCategory = async (id: any) => {
    await requestService.delete(import.meta.env.VITE_API_URL + "/admin/categories/" + id)
 getCat()
  }

  const [catId, setCatId] = useState<string | null>(null)
  const [catData, setCatData] = useState<CatData | null>(null)

  const toggleForm = (id: string, data: CatData) => {
    setCatId(prev => (prev === id ? null : id));
    setCatData(prev => (prev === data ? null : data))
  };

  const [catName, setCatName] = useState<string>("")
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await requestService.post(import.meta.env.VITE_API_URL + "/admin/categories",
      {
        name: catName
      }
    )
    getCat()
  }

  return (
    <>
    <section className={style.section}>
      <h3 className={style.title}>Toutes les catégories disponibles</h3>
            <div className={style.filterBox}>
        <form
          className={style.questionForm}
          name="addCategory"
          id="addCategory"
          onSubmit={submitForm}
        >
          <InputsComponent
            type="text"
            label="Ajout d'une catégorie"
            name="search"
            placeholder="Entrez votre catégorie ici"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            tabIndex={1}
          />
          <ButtonComponent id="submitCategory" label="Ajouter" />
        </form>
      </div>
      <div className={style.tableWrap}>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>slug</th>
            <th>Modifier</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {
            category && category != null ?
              category.map((q: any) => {
                return (
                  <tr key={q.id}>
                    <td>{q.name}</td>
                    <td>{q.slug}</td>
                    <td><ActionComponent label='Modifier' type='action' id='modify' onClick={() => toggleForm(q.id, q)} /></td>
                    <td><ActionComponent label='Supprimer' type='alert' id='delete' onClick={() => deleteCategory(q.id)} /></td>
                  </tr>
                )
              }) : null
          }
        </tbody>
      </table>
      </div>
    </section>
    {catId && catData ? (
      <UpdateCatModalComponent
        data={catData}
        cb={() => getCat()}
        toggle={() => toggleForm(catId, catData)}
      />
    ) : null}
    </>
  );
}

export default CategoryComponent;
