
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://pokeapi.co/api/v2/type')
        .then(response => response.json())
        .then(data => {
            const types = data.results.map(type => type.name);
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                types.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                    select.appendChild(option);
                });
            });
        })
        .catch(error => console.error('Error fetching Pokemon types:', error));
});

async function analyzeTeam() {
    const types = [
        document.getElementById('pokemon1Type1').value.toLowerCase(),
        document.getElementById('pokemon1Type2').value.toLowerCase(),
        document.getElementById('pokemon2Type1').value.toLowerCase(),
        document.getElementById('pokemon2Type2').value.toLowerCase(),
        document.getElementById('pokemon3Type1').value.toLowerCase(),
        document.getElementById('pokemon3Type2').value.toLowerCase(),
        document.getElementById('pokemon4Type1').value.toLowerCase(),
        document.getElementById('pokemon4Type2').value.toLowerCase(),
        document.getElementById('pokemon5Type1').value.toLowerCase(),
        document.getElementById('pokemon5Type2').value.toLowerCase(),
        document.getElementById('pokemon6Type1').value.toLowerCase(),
        document.getElementById('pokemon6Type2').value.toLowerCase()
    ].filter(type => type);

    const typeData = await Promise.all(types.map(type => fetch(`https://pokeapi.co/api/v2/type/${type}`).then(response => response.json())));

    const weaknesses = {};
    const resistances = {};

    typeData.forEach(data => {
        data.damage_relations.double_damage_from.forEach(type => {
            weaknesses[type.name] = (weaknesses[type.name] || 0) + 1;
        });
        data.damage_relations.half_damage_from.forEach(type => {
            resistances[type.name] = (resistances[type.name] || 0) + 1;
        });
        data.damage_relations.no_damage_from.forEach(type => {
            resistances[type.name] = (resistances[type.name] || 0) + 1;
        });
    });

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p>Weaknesses: ${Object.keys(weaknesses).map(type => `${type} (${weaknesses[type]})`).join(', ')}</p>
        <p>Resistances: ${Object.keys(resistances).map(type => `${type} (${resistances[type]})`).join(', ')}</p>
    `;
}