from ..auth.auth import token_required, role_required
##from ..services.users_service import DiscussionService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.discussion_schema import DiscussionSchema
from ..models.topic import Topic
from ..models.discussion import Discussion
from ..database import db
from ..services.topic_service import TopicService
from ..models.comment import Comment

discussions_blueprint = Blueprint('discussions', __name__)

@discussions_blueprint.route('/discussions', methods=['GET'])
def get_all_discussions():
    discussions = Discussion.query.all()

    unique_topic_ids = {discussion.topic_id for discussion in discussions}
    unique_discussion_ids = {discussion.id for discussion in discussions}

    # Učitaj sve teme povezane sa diskusijama
    topics = Topic.query.filter(Topic.id.in_(unique_topic_ids)).all()
    topic_map = {topic.id: {"id": topic.id, "name": topic.name, "description": topic.description} for topic in topics}

    # Učitaj sve komentare povezane sa diskusijama
    comments = Comment.query.filter(Comment.discussion_id.in_(unique_discussion_ids)).all()
    comment_map = {}
    for comment in comments:
        if comment.discussion_id not in comment_map:
            comment_map[comment.discussion_id] = []
        comment_map[comment.discussion_id].append({
            "id": comment.id,
            "author_id": comment.author_id,
            "text": comment.text,
            "creation_date": comment.creation_date
        })

    discussion_schema = DiscussionSchema(many=True)
    discussions_data = discussion_schema.dump(discussions)

    # Dodaj temu i komentare za svaku diskusiju
    for discussion in discussions_data:
        topic_id = discussion["topic_id"]
        discussion["topic"] = topic_map.get(topic_id, None)
        
        discussion_id = discussion["id"]
        discussion["comments"] = comment_map.get(discussion_id, [])
    print(discussions_data)
    return jsonify(discussions_data), 200


@discussions_blueprint.route('/userdiscussions', methods=['GET'])
@token_required
def get_user_discussions(current_user):
    
    # Filtriramo diskusije prema korisniku koji je trenutno prijavljen
    discussions = Discussion.query.filter_by(author_id=current_user.id).all()

    # Ako nema diskusija za ovog korisnika, vraćamo praznu listu
    if not discussions:
        return jsonify({"message": "No discussions found for this user."}), 404

    # Izdvajamo jedinstvene topic_id-eve iz diskusija
    unique_topic_ids = {discussion.topic_id for discussion in discussions}

    # Filtriramo teme koje odgovaraju tim topic_id-evima
    topics = Topic.query.filter(Topic.id.in_(unique_topic_ids)).all()

    # Kreiramo mapu tema po njihovim ID-evima za brži pristup
    topic_map = {topic.id: {"id": topic.id, "name": topic.name, "description": topic.description} for topic in topics}  

    # Serijalizujemo diskusije
    discussion_schema = DiscussionSchema(many=True)
    discussions_data = discussion_schema.dump(discussions)

    # Dodajemo podatke o temi svakoj diskusiji
    for discussion in discussions_data:
        topic_id = discussion["topic_id"]
        discussion["topic"] = topic_map.get(topic_id, None)  # Dodaj temu ili None ako nije pronađena
    
    return jsonify(discussions_data), 200

@discussions_blueprint.route('/create-discussion', methods=['POST'])
@token_required  # Pretpostavljamo da je korisnik autentifikovan
def create_discussion(current_user):
    # Uzmi podatke iz zahteva
    data = request.get_json()

    # Proveri da li su svi potrebni podaci prisutni
    title = data.get("title")
    text = data.get("text")
    topic_id = data.get("topic_id")

    if not title or not text or not topic_id:
        return jsonify({"message": "Title, text, and topic_id are required."}), 400

    # Proveri da li tema postoji koristeći TopicService
    try:
        topic = TopicService.get_topic_by_id(topic_id)  # Koristi postojeći servis
    except ValueError as e:
        return jsonify({"message": str(e)}), 404

    # Kreiraj novu diskusiju
    new_discussion = Discussion(
        title=title,
        text=text,
        topic_id=topic_id,
        author_id=current_user.id  # Korisnik koji je kreirao diskusiju
    )

    try:
        # Dodaj diskusiju u bazu podataka
        db.session.add(new_discussion)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating discussion.", "error": str(e)}), 500

    # Serijalizuj novu diskusiju i vrati je kao odgovor
    discussion_schema = DiscussionSchema()
    discussion_data = discussion_schema.dump(new_discussion)

    return jsonify(discussion_data), 201