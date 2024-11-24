"""ajmo sad mozda

Revision ID: f6a1872ee810
Revises: 
Create Date: 2024-11-23 21:18:10.603023

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f6a1872ee810'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('discussions', schema=None) as batch_op:
        batch_op.drop_constraint('discussions_topic_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'topics', ['topic_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('discussions', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('discussions_topic_id_fkey', 'topics', ['topic_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###
