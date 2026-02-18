from models import Topic, UserTopic
from app import db
from datetime import datetime


def update_user_interest(user_id, topic_name):

    topic = Topic.query.filter_by(topic_name=topic_name).first()

    if not topic:
        topic = Topic(topic_name=topic_name)
        db.session.add(topic)
        db.session.commit()

    user_topic = UserTopic.query.filter_by(
        user_id=user_id, topic_id=topic.id
    ).first()

    if user_topic:
        user_topic.interest_score += 1
        user_topic.last_interaction = datetime.utcnow()
    else:
        user_topic = UserTopic(
            user_id=user_id,
            topic_id=topic.id,
            interest_score=1,
            last_interaction=datetime.utcnow(),
        )
        db.session.add(user_topic)

    db.session.commit()
