export const columns = [
    { key: 'id', label: 'S.No', sortable: false, width: '1fr' },
    { key: 'name', label: 'Name', sortable: true, width: '1fr' },
    {
        key: 'age',
        label: 'Age',
        sortable: true,
        width: '1fr',
        render: ((value, row) => {
            const div = document.createElement('div');
            div.textContent = value;
            div.style.color = value > 50 ? 'red' : 'green';
            div.style.fontWeight = 'bold';
            return div;
        })
    },
    { key: 'rollNo', label: 'Roll No', sortable: true, width: '1fr' },


    // { key: 'rollNo', label: 'Roll No', sortable: true, width: '1fr' },

    // {
    //     key: 'age',
    //     label: 'Age',
    //     sortable: true,
    //     width: '1fr',
    //     render: ((value, row) => {
    //         const div = document.createElement('div');
    //         div.textContent = value;
    //         div.style.color = value > 50 ? 'red' : 'green';
    //         div.style.fontWeight = 'bold';
    //         return div;
    //     })
    // },

    // { key: 'rollNo', label: 'Roll No', sortable: true, width: '2fr' },

    // {
    //     key: 'age',
    //     label: 'Age',
    //     sortable: true,
    //     width: '1fr',
    //     render: ((value, row) => {
    //         const div = document.createElement('div');
    //         div.textContent = value;
    //         div.style.color = value > 50 ? 'red' : 'green';
    //         div.style.fontWeight = 'bold';
    //         return div;
    //     })
    // },
    // { key: 'rollNo', label: 'Roll No', sortable: true, width: '1fr' },

    // {
    //     key: 'age',
    //     label: 'Age',
    //     sortable: true,
    //     width: '1fr',
    //     render: ((value, row) => {
    //         const div = document.createElement('div');
    //         div.textContent = value;
    //         div.style.color = value > 50 ? 'red' : 'green';
    //         div.style.fontWeight = 'bold';
    //         return div;
    //     })
    // },

    // { key: 'rollNo', label: 'Roll No', sortable: true, width: '1fr' },

    // {
    //     key: 'age',
    //     label: 'Age',
    //     sortable: true,
    //     width: '1fr',
    //     render: ((value, row) => {
    //         const div = document.createElement('div');
    //         div.textContent = value;
    //         div.style.color = value > 50 ? 'red' : 'green';
    //         div.style.fontWeight = 'bold';
    //         return div;
    //     })
    // }, { key: 'rollNo', label: 'Roll No', sortable: true, width: '1fr' },

    // {
    //     key: 'age',
    //     label: 'Age',
    //     sortable: true,
    //     width: '1fr',
    //     render: ((value, row) => {
    //         const div = document.createElement('div');
    //         div.textContent = value;
    //         div.style.color = value > 50 ? 'red' : 'green';
    //         div.style.fontWeight = 'bold';
    //         return div;
    //     })
    // },



]