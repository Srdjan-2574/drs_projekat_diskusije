"""added an address field that we somethow misseed

Revision ID: d0def6ee9061
Revises: b95cffeff88b
Create Date: 2024-11-19 18:57:18.125901

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd0def6ee9061'
down_revision = 'b95cffeff88b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('address', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('address')

    # ### end Alembic commands ###
