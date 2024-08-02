document.addEventListener("DOMContentLoaded", () => {
    loadComments();

    const stars = document.querySelectorAll('.stars label');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.getAttribute('data-value');
            updateStarColors(rating);
        });
    });
});

function loadComments() {
    const commentsContainer = document.getElementById('comments');
    commentsContainer.innerHTML = '<p>Carregando comentários...</p>';

    fetch('http://localhost:3000/comments')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os comentários');
            }
            return response.json();
        })
        .then(data => {
            commentsContainer.innerHTML = '';
            data.forEach(comment => {
                addCommentToDOM(comment);
            });
        })
        .catch(error => {
            commentsContainer.innerHTML = `<p>Erro ao carregar comentários: ${error.message}</p>`;
        });
}

function submitComment() {
    const userName = document.getElementById('userName').value;
    const comment = document.getElementById('comment').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const submitButton = document.getElementById('submitCommentButton');
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: userName, comment: comment, rating: rating })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao enviar o comentário');
        }
        return response.json();
    })
    .then(data => {
        const newComment = { name: userName, comment: comment, rating: rating };
        addCommentToDOM(newComment);
        document.getElementById('userName').value = '';
        document.getElementById('comment').value = '';
        document.querySelector('input[name="rating"]:checked').checked = false;
        updateStarColors(0);
    })
    .catch(error => {
        alert(`Erro ao enviar comentário: ${error.message}`);
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Comentário';
    });
}

function addCommentToDOM(comment) {
    const commentsContainer = document.getElementById('comments');
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `
        <p><strong>${comment.name}</strong> (${getStars(comment.rating)})</p>
        <p>${comment.comment}</p>
    `;
    commentsContainer.appendChild(commentDiv);
}

function getStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function updateStarColors(rating) {
    const stars = document.querySelectorAll('.stars label');
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}