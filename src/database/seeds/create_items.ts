import Knex from 'knex'

export async function seed(knex:Knex) {
    await knex('items').insert([
        {
            title: 'Papéis e Papelão', 
            image: 'papeis-papelao.svg'
        },
        {
            title: 'Vidros e Lâmpadas', 
            image: 'lampadas.svg'
        },
        {
            title: 'Óleo de Cozinha', 
            image: 'oleo.svg'
        },
        {
            title: 'Resíduos Orgânicos', 
            image: 'organicos.svg'
        },
        {
            title: 'Baterias e Pilhas', 
            image: 'baterias.svg'
        },
        {
            title: 'Eletrônicos', 
            image: 'eletronicos.svg'
        }
    ])
}