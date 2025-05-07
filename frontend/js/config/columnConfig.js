export const columns = [
    { key: 'id', label: 'S.No', sortable: false, width: '300px' },
    {
        key: 'name',
        label: 'Name',
        sortable: true,
        searchable: true,
        width: '300px'
    },
    {
        key: 'age',
        label: 'Age',
        sortable: true,
        width: '300px',
        render: ((value) => {
            const div = document.createElement('div');
            div.textContent = value;
            div.style.color = value > 50 ? 'red' : 'green';
            div.style.fontWeight = 'bold';
            return div;
        })
    },
    { key: 'rollNo', label: 'Roll No', sortable: true, width: '100px' },

]